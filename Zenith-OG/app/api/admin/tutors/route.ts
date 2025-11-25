export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withAdminAuth } from '@/middleware/adminAuth'
import type { AdminAuthResult } from '@/middleware/adminAuth'

const prisma = new PrismaClient()

// GET: Fetch all tutor applications
async function handleGet(request: NextRequest, authResult: AdminAuthResult) {
  try {
    // Fetch all tutor applications
    const applications = await prisma.tutorApplication.findMany({
      orderBy: {
        submittedAt: 'desc'
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      applications: applications.map(app => ({
        id: app.id,
        userId: app.userId,
        fullName: app.fullName || `${app.user.firstName} ${app.user.lastName}`,
        email: app.user.email,
        phone: app.user.phone,
        institution: app.institution,
        modules: app.modules,
        qualification: app.qualification,
        hourlyRate: app.hourlyRate,
        bio: app.bio,
        profilePicture: app.profilePicture,
        proofOfRegistration: app.proofOfRegistration,
        transcript: app.transcript,
        status: app.status,
        submittedAt: app.submittedAt,
        reviewedAt: app.reviewedAt,
        reviewedBy: app.reviewedBy,
        rejectionReason: app.rejectionReason,
        verificationNotes: app.verificationNotes
      }))
    })

  } catch (error) {
    console.error('Error fetching tutor applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tutor applications' },
      { status: 500 }
    )
  }
}

export const GET = withAdminAuth(handleGet)
