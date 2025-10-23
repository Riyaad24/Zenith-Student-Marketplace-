import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'

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

    // Create user and security record in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user profile
      const user = await tx.user.create({
        data: {
          email,
          firstName,
          lastName,
          university,
          phone,
          verified: false,
        },
      })

      // Create security record
      await tx.accountSecurity.create({
        data: {
          userId: user.id,
          passwordHash,
          salt,
          emailVerificationToken: randomBytes(32).toString('hex'),
        },
      })

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

      return user
    })

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.id, 
        email: result.email,
        roles: ['student']
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
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
      roles: ['student']
    }

    return NextResponse.json({
      success: true,
      user: userData,
      token,
      message: 'Account created successfully!'
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}