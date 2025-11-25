import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function getAuthenticatedUser(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) return null

    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }

}

// POST /api/user/verify-email - Verify email with code
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 })
    }

    // Find valid verification code
    const verificationRecord = await prisma.emailVerificationCode.findFirst({
      where: {
        userId: user.id,
        code: code.toString(),
        expiresAt: {
          gte: new Date()
        }
      }
    })

    if (!verificationRecord) {
      return NextResponse.json({ 
        error: 'Invalid or expired verification code' 
      }, { status: 400 })
    }

    // Update user's email verification status
    await prisma.$transaction(async (tx) => {
      // Update account security
      await tx.accountSecurity.update({
        where: { userId: user.id },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date()
        }
      })

      // Delete used verification code
      await tx.emailVerificationCode.delete({
        where: { id: verificationRecord.id }
      })

      // Create success notification
      await tx.notification.create({
        data: {
          userId: user.id,
          type: 'email_verified',
          title: '✅ Email Verified Successfully!',
          message: 'Your email has been verified. You now have full access to all marketplace features.',
          read: false
        }
      })
    })

    console.log(`✅ Email verified for user: ${user.email}`)

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    })
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 })
  }
}
