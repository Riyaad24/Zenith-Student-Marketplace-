import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import { isAdminEmail, extractStudentNumber, checkAdminQuota, ADMIN_PERMISSIONS } from '@/lib/admin-auth'
import { cookies } from 'next/headers'

const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, university, phone } = await request.json()

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

    // Exact admin signup logic as requested
    const ADMIN_EMAIL_REGEX = /^(\d{9})ads@my\.richfield\.ac\.za$/i
    const ADMIN_MAX = parseInt(process.env.ADMIN_MAX_ADMINS || '14', 10)

    const emailLower = (email || '').toLowerCase()
    const adminMatch = emailLower.match(ADMIN_EMAIL_REGEX)
    const isAdminAttempt = !!adminMatch
    let adminCreated = false
    let adminQuotaReached = false

    // Create user and security record in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Check if this will be an admin user first
      const willBeAdmin = adminMatch ? (await tx.admin.count({ where: { isActive: true } })) < ADMIN_MAX : false

      // Create user profile - admins are automatically verified
      const user = await tx.user.create({
        data: {
          email,
          firstName,
          lastName,
          university,
          phone,
          verified: willBeAdmin, // Admins are auto-verified
          documentsUploaded: willBeAdmin, // Admins don't need to upload docs
          adminVerified: willBeAdmin, // Admins are pre-verified
          verifiedAt: willBeAdmin ? new Date() : null,
        },
      })

      // Create security record - admins have email auto-verified
      await tx.accountSecurity.create({
        data: {
          userId: user.id,
          passwordHash,
          salt,
          emailVerificationToken: randomBytes(32).toString('hex'),
          emailVerified: willBeAdmin, // Admins have email auto-verified
          emailVerifiedAt: willBeAdmin ? new Date() : null,
        },
      })

      // Only create verification reminder notification for non-admin users
      if (!willBeAdmin) {
        await tx.notification.create({
          data: {
            userId: user.id,
            type: 'verification_reminder',
            title: '🎓 Welcome to Zenith! Complete Your Verification',
            message: 'To unlock full marketplace access and build trust with other students, please submit your verification documents: Profile Picture, Proof of Registration, and Certified ID Copy.',
            read: false,
          },
        })
      } else {
        // Create welcome notification for admins
        await tx.notification.create({
          data: {
            userId: user.id,
            type: 'admin_welcome',
            title: '🎉 Welcome to Zenith Admin Portal!',
            message: 'Your admin account has been created and fully verified. You now have access to all administrative features.',
            read: false,
          },
        })
      }

      // Handle admin user creation if email matches pattern
      if (adminMatch) {
        const studentDigits = adminMatch[1]

        // Count existing linked admins
        const currentAdmins = await tx.admin.count({
          where: { isActive: true }
        })

        if (currentAdmins < ADMIN_MAX) {
          // Create admin record
          await tx.admin.create({
            data: {
              userId: user.id,
              studentNumber: studentDigits,
              email: emailLower,
              permissions: [
                ADMIN_PERMISSIONS.USERS_READ,
                ADMIN_PERMISSIONS.USERS_CREATE,
                ADMIN_PERMISSIONS.USERS_UPDATE,
                ADMIN_PERMISSIONS.USERS_DELETE,
                ADMIN_PERMISSIONS.PRODUCTS_READ,
                ADMIN_PERMISSIONS.PRODUCTS_UPDATE,
                ADMIN_PERMISSIONS.PRODUCTS_DELETE,
                ADMIN_PERMISSIONS.ORDERS_READ,
                ADMIN_PERMISSIONS.ORDERS_UPDATE,
                ADMIN_PERMISSIONS.LOGS_READ
              ],
              isActive: true
            }
          })

          // Find or create admin role
          let adminRole = await tx.userRole.findUnique({
            where: { name: 'admin' }
          })

          if (!adminRole) {
            adminRole = await tx.userRole.create({
              data: {
                name: 'admin',
                description: 'Administrator role with full access',
                permissions: JSON.stringify(['admin', 'read', 'create', 'update', 'delete'])
              }
            })
          }

          // Assign admin role
          await tx.userRoleAssignment.create({
            data: {
              userId: user.id,
              roleId: adminRole.id,
            },
          })

          adminCreated = true
        } else {
          adminQuotaReached = true
          // Create user normally but do not create admins row
        }
      }

      // If not admin or quota reached, assign student role
      if (!adminCreated) {
        // Find or create default student role
        let studentRole = await tx.userRole.findUnique({
          where: { name: 'student' }
        })

        if (!studentRole) {
          studentRole = await tx.userRole.create({
            data: {
              name: 'student',
              description: 'Default student role',
              permissions: JSON.stringify(['read', 'create_listing', 'purchase', 'message'])
            }
          })
        }

        // Assign student role
        await tx.userRoleAssignment.create({
          data: {
            userId: user.id,
            roleId: studentRole.id,
          },
        })
      }

      return user
    })

    // Generate JWT token
    const userRoles = adminCreated ? ['admin'] : ['student']
    const token = jwt.sign(
      { 
        userId: result.id, 
        email: result.email,
        roles: userRoles
      },
      jwtSecret,
      { expiresIn: '24h' }
    )

    // Return user data and token
    const userData = {
      id: result.id,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      university: result.university,
      verified: result.verified,
      roles: userRoles,
      isAdmin: adminCreated
    }

    // Prepare response message
    let message = 'Account created successfully!'
    if (isAdminAttempt && adminQuotaReached) {
      message += ' Note: Admin quota reached, created as regular user.'
    }

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    console.log('Register API: Cookie set for user:', result.email)

    return NextResponse.json({
      success: true,
      user: userData,
      token,
      message,
      adminQuotaReached: isAdminAttempt && adminQuotaReached
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}