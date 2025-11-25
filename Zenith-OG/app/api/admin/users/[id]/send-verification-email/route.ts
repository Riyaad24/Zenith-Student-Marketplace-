export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdminAuth } from '@/middleware/adminAuth'
import { hasPermission, ADMIN_PERMISSIONS } from '@/lib/admin-auth'

// POST /api/admin/users/[id]/send-verification-email
async function handleSendVerificationEmail(
  request: NextRequest,
  authResult: any,
  { params }: { params: { id: string } }
) {
  try {
    const admin = authResult.admin
    if (!hasPermission(admin, ADMIN_PERMISSIONS.USERS_UPDATE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        security: {
          select: {
            emailVerified: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.security?.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    }

    // Generate 5-digit verification code
    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Store verification code in database
    await prisma.$transaction(async (tx) => {
      // Delete any existing verification codes for this user
      await tx.emailVerificationCode.deleteMany({
        where: { userId: params.id }
      })

      // Create new verification code
      await tx.emailVerificationCode.create({
        data: {
          userId: params.id,
          code: verificationCode,
          expiresAt
        }
      })

      // Create notification for user
      await tx.notification.create({
        data: {
          userId: params.id,
          type: 'email_verification',
          title: '📧 Email Verification Code',
          message: `Your email verification code is: ${verificationCode}. This code will expire in 15 minutes. Please enter this code in your account settings to verify your email.`,
          read: false
        }
      })
    })

    console.log(`✅ Email verification code generated for user ${user.email}: ${verificationCode}`)

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully',
      // Include code in response for demo purposes (in production, send via email)
      verificationCode,
      expiresAt
    })
  } catch (error) {
    console.error('Send verification email error:', error)
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }
}

export const POST = withAdminAuth(handleSendVerificationEmail)
