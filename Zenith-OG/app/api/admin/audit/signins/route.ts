export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdminAuth } from '@/middleware/adminAuth'

// GET /admin/audit/signins - Get admin sign-in logs
async function handleSigninsGet(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const adminId = url.searchParams.get('adminId')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (adminId) {
      where.adminId = adminId
    }
    
    if (from || to) {
      where.signInAt = {}
      if (from) where.signInAt.gte = new Date(from)
      if (to) where.signInAt.lte = new Date(to)
    }

    // Get sign-in logs with admin details
    const [signinLogs, total] = await Promise.all([
      prisma.adminSignInLog.findMany({
        where,
        include: {
          admin: {
            include: {
              user: {
                select: {
                  email: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { signInAt: 'desc' }
      }),
      prisma.adminSignInLog.count({ where })
    ])

    const formattedLogs = signinLogs.map(log => ({
      id: log.id,
      adminId: log.adminId,
      adminEmail: log.admin.user.email,
      adminName: `${log.admin.user.firstName} ${log.admin.user.lastName}`,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      location: log.location,
      deviceInfo: log.deviceInfo,
      signInAt: log.signInAt
    }))

    return NextResponse.json({
      logs: formattedLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Admin signin logs error:', error)
    return NextResponse.json({ error: 'Failed to fetch signin logs' }, { status: 500 })
  }
}

export const GET = withAdminAuth(handleSigninsGet)