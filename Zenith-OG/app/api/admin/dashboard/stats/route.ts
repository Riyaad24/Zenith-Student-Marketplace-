export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdminAuth } from '@/middleware/adminAuth'

// GET /api/admin/dashboard/stats - Get dashboard statistics
async function handleStatsGet(request: NextRequest, authResult: any) {
  try {

    // Get statistics in parallel
    const [
      totalUsers,
      totalAdmins,
      totalProducts,
      totalOrders,
      recentSignins,
      activeUsers
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total admins
      prisma.admin.count({ where: { isActive: true } }),
      
      // Total products
      prisma.product.count(),
      
      // Total orders
      prisma.order.count(),
      
      // Recent sign-ins (last 24 hours)
      prisma.adminSignInLog.count({
        where: {
          signInAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Active users (logged in within last 7 days)
      prisma.accountSecurity.count({
        where: {
          lastLogin: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ])

    return NextResponse.json({
      stats: {
        totalUsers,
        totalAdmins,
        totalProducts,
        totalOrders,
        recentSignins,
        activeUsers
      }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

export const GET = withAdminAuth(handleStatsGet)