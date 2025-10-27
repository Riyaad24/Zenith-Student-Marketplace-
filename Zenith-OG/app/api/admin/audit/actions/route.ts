import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdminAuth } from '@/middleware/adminAuth'

// GET /admin/audit/actions - Get admin action logs
async function handleActionsGet(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const adminId = url.searchParams.get('adminId')
    const action = url.searchParams.get('action')
    const targetType = url.searchParams.get('targetType')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (adminId) {
      where.adminId = adminId
    }
    
    if (action) {
      where.action = { contains: action, mode: 'insensitive' }
    }
    
    if (targetType) {
      where.targetType = targetType
    }
    
    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(from)
      if (to) where.createdAt.lte = new Date(to)
    }

    // Get audit logs with admin details
    const [auditLogs, total] = await Promise.all([
      prisma.adminAuditLog.findMany({
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
        orderBy: { createdAt: 'desc' }
      }),
      prisma.adminAuditLog.count({ where })
    ])

    const formattedLogs = auditLogs.map(log => ({
      id: log.id,
      adminId: log.adminId,
      adminEmail: log.admin?.user.email || 'System',
      adminName: log.admin ? `${log.admin.user.firstName} ${log.admin.user.lastName}` : 'System',
      action: log.action,
      targetType: log.targetType,
      targetId: log.targetId,
      oldValues: log.oldValues,
      newValues: log.newValues,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: log.createdAt
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
    console.error('Admin audit logs error:', error)
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
  }
}

export const GET = withAdminAuth(handleActionsGet)