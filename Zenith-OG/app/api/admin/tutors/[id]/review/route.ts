import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withAdminAuth } from '@/middleware/adminAuth'
import type { AdminAuthResult } from '@/middleware/adminAuth'

const prisma = new PrismaClient()

// PATCH: Review tutor application (approve/reject)
async function handlePatch(
  request: NextRequest,
  authResult: AdminAuthResult,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { action, rejectionReason, verificationNotes } = body

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (action === 'reject' && !rejectionReason) {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 })
    }

    // Fetch the application
    const application = await prisma.tutorApplication.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Update the application
    const updatedApplication = await prisma.tutorApplication.update({
      where: { id: params.id },
      data: {
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewedAt: new Date(),
        reviewedBy: authResult.adminId || undefined,
        rejectionReason: action === 'reject' ? rejectionReason : null,
        verificationNotes: verificationNotes || null
      }
    })

    // If approved, update user to have tutor role
    if (action === 'approve') {
      await prisma.user.update({
        where: { id: application.userId },
        data: {
          isTutor: true,
          tutorVerified: true
        }
      })
    }

    // Create notification for the user
    const notificationTitle = action === 'approve' 
      ? 'Tutor Application Approved! 🎉'
      : 'Tutor Application Update'
    
    const notificationMessage = action === 'approve'
      ? 'Congratulations! Your tutor application has been approved. You can now start accepting students and earning on Zenith.'
      : `Your tutor application has been reviewed. Reason: ${rejectionReason}`

    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: action === 'approve' ? 'tutor_approved' : 'tutor_rejected',
        title: notificationTitle,
        message: notificationMessage,
        metadata: {
          applicationId: application.id,
          action: action,
          link: action === 'approve' ? '/account/tutor' : '/categories/tutoring/become-tutor'
        },
        read: false
      }
    })

    // Log admin action
    await prisma.adminAuditLog.create({
      data: {
        adminId: authResult.adminId,
        action: `${action.toUpperCase()}_TUTOR_APPLICATION`,
        targetType: 'TUTOR_APPLICATION',
        targetId: application.id,
        oldValues: { status: application.status },
        newValues: { 
          status: action === 'approve' ? 'approved' : 'rejected',
          rejectionReason: rejectionReason || null,
          verificationNotes: verificationNotes || null
        },
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown',
        userAgent: request.headers.get('user-agent') || null
      }
    })

    return NextResponse.json({
      success: true,
      message: `Application ${action}d successfully`,
      application: updatedApplication
    })

  } catch (error) {
    console.error('Error reviewing tutor application:', error)
    return NextResponse.json(
      { error: 'Failed to review application' },
      { status: 500 }
    )
  }
}

export const PATCH = withAdminAuth(handlePatch)

