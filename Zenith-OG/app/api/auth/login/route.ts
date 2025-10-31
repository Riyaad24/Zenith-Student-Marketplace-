import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getClientIP } from '@/lib/admin-auth'
import { logAdminSignin } from '@/lib/audit'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email: loginEmail, password } = await request.json()

    if (!loginEmail || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: loginEmail },
      include: {
        security: true,
        admin: true,
        roleAssignments: {
          include: {
            role: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user has security record
    if (!user.security) {
      return NextResponse.json(
        { error: 'User account not properly configured' },
        { status: 500 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.security.passwordHash)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update last login
    await prisma.accountSecurity.update({
      where: { userId: user.id },
      data: { lastLogin: new Date() }
    })

    // Exact login logic as requested
    const ADMIN_EMAIL_REGEX = /^(\d{9})ads@my\.richfield\.ac\.za$/i
    const userEmail = (user.email || '').toLowerCase()
    const adminMatch = userEmail.match(ADMIN_EMAIL_REGEX)
    
    if (adminMatch) {
      const studentDigits = adminMatch[1]
      
      // Check if there's an admins row linked to this user (by student_number OR user_id)
      const admin = await prisma.admin.findFirst({
        where: {
          OR: [
            { studentNumber: studentDigits },
            { userId: user.id }
          ]
        }
      })
      
      if (admin) {
        // Log admin signin
        const ipAddress = getClientIP(request)
        const userAgent = request.headers.get('user-agent') || undefined
        
        await logAdminSignin(user.id, userEmail, ipAddress, userAgent || null)
        
        // Return redirect to admin dashboard
        const roles = user.roleAssignments.map(ra => ra.role.name)
        const token = jwt.sign(
          { 
            userId: user.id, 
            email: user.email,
            roles
          },
          process.env.NEXTAUTH_SECRET || 'fallback-secret',
          { expiresIn: '24h' }
        )

        const userData = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          university: user.university,
          verified: user.verified,
          roles,
          isAdmin: true
        }

        // Set HTTP-only cookie
        const cookieStore = await cookies()
        cookieStore.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24, // 24 hours
        })

        console.log('Login API: Admin cookie set')

        return NextResponse.json({
          success: true,
          user: userData,
          token,
          admin: true,
          redirect: '/admin/dashboard',
          message: 'Login successful'
        })
      }
    }

    // Generate JWT token for regular users
    const roles = user.roleAssignments.map(ra => ra.role.name)
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        roles
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    // Return user data and token
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      university: user.university,
      verified: user.verified,
      roles,
      isAdmin: false
    }

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    console.log('Login API: User cookie set')

    return NextResponse.json({
      success: true,
      user: userData,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}