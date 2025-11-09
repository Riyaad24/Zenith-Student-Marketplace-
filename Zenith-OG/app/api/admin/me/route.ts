import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdminAuth, AdminAuthResult } from '@/middleware/adminAuth'

// GET /api/admin/me - Get current admin's information
async function handleGetAdminMe(request: NextRequest, authResult: AdminAuthResult) {
  try {
    // Fetch admin user details
    const admin = await prisma.user.findUnique({
      where: { id: authResult.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        admin: {
          select: {
            studentNumber: true,
            permissions: true,
            isActive: true
          }
        }
      }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      admin: {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        studentNumber: admin.admin?.studentNumber || null,
        permissions: admin.admin?.permissions || [],
        isActive: admin.admin?.isActive || false
      }
    })
  } catch (error) {
    console.error('Get admin me error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin information' },
      { status: 500 }
    )
  }
}

export const GET = withAdminAuth(handleGetAdminMe)
