import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdminAuth, AdminAuthResult } from '@/middleware/adminAuth'
import { getClientIP } from '@/lib/admin-auth'
import { auditLog } from '@/lib/audit'
import bcrypt from 'bcryptjs'

// GET /api/admin/users - List users with search and pagination
async function handleUsersGet(request: NextRequest, authResult: AdminAuthResult) {
  try {

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status') // 'active', 'inactive', 'all'
    const role = url.searchParams.get('role') // 'admin', 'student', 'all'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { university: { contains: search } }
      ]
    }

    if (status === 'active') {
      where.verified = true
    } else if (status === 'inactive') {
      where.verified = false
    }

    if (role && role !== 'all') {
      where.roleAssignments = {
        some: {
          role: { name: role }
        }
      }
    }

    // Log search query for audit
    const searchQuery = search ? `search:${search}` : null
    await auditLog(authResult.adminId || null, null, 'SEARCH_USERS', searchQuery, getClientIP(request))

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          roleAssignments: {
            include: { role: true }
          },
          admin: true,
          security: {
            select: {
              lastLogin: true,
              emailVerified: true,
              accountLocked: true
            }
          },
          _count: {
            select: {
              products: true,
              orders: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        university: user.university,
        verified: user.verified,
        isAdmin: !!user.admin,
        roles: user.roleAssignments.map(ra => ra.role.name),
        lastLogin: user.security?.lastLogin,
        emailVerified: user.security?.emailVerified,
        accountLocked: user.security?.accountLocked,
        productsCount: user._count.products,
        ordersCount: user._count.orders,
        createdAt: user.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Admin users list error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST /api/admin/users - Create new user
async function handleUsersPost(request: NextRequest, authResult: AdminAuthResult) {
  try {

    const { email, password, firstName, lastName, university, phone, role = 'student' } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          firstName,
          lastName,
          university,
          phone,
          verified: true // Admin-created users are auto-verified
        }
      })

      // Create security record
      await tx.accountSecurity.create({
        data: {
          userId: user.id,
          passwordHash,
          salt,
          emailVerified: true
        }
      })

      // Assign role
      const userRole = await tx.userRole.findUnique({
        where: { name: role }
      })

      if (userRole) {
        await tx.userRoleAssignment.create({
          data: {
            userId: user.id,
            roleId: userRole.id
          }
        })
      }

      return user
    })

    // Log admin action
    await auditLog(authResult.adminId || null, newUser.id, 'CREATE_USER', null, getClientIP(request))

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        university: newUser.university,
        verified: newUser.verified
      },
      message: 'User created successfully'
    })
  } catch (error) {
    console.error('Admin create user error:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

export const GET = withAdminAuth(handleUsersGet)
export const POST = withAdminAuth(handleUsersPost)