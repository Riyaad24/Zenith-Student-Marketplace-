import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Verify user is admin
    const admin = await prisma.admin.findFirst({
      where: { userId: decoded.userId, isActive: true }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Calculate date ranges
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // Get comprehensive statistics
    const [
      totalUsers,
      usersLast30Days,
      usersLast7Days,
      usersToday,
      totalProducts,
      productsLast30Days,
      activeProducts,
      totalOrders,
      ordersLast30Days,
      totalRevenue,
      pendingVerifications,
      unreadSupport,
      totalMessages,
      messagesLast7Days,
      totalReviews,
      avgRating,
    ] = await Promise.all([
      // User statistics
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: yesterday } } }),
      
      // Product statistics
      prisma.product.count(),
      prisma.product.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.product.count({ where: { status: 'available' } }),
      
      // Order statistics
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.order.aggregate({ _sum: { total: true } }),
      
      // Verification statistics
      prisma.user.count({ 
        where: { 
          documentsUploaded: true,
          adminVerified: false
        } 
      }),
      
      // Support statistics
      prisma.supportMessage.count({ where: { read: false } }),
      
      // Message statistics
      prisma.message.count(),
      prisma.message.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      
      // Review statistics
      prisma.review.count(),
      prisma.review.aggregate({ _avg: { rating: true } }),
    ])

    // Get user growth data (last 30 days)
    const userGrowth = await prisma.$queryRaw<Array<{ date: Date; count: number }>>`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM profiles
      WHERE created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `

    // Get product category breakdown
    const categoryBreakdown = await prisma.product.groupBy({
      by: ['categoryId'],
      _count: { categoryId: true },
      orderBy: { _count: { categoryId: 'desc' } }
    })

    // Get category names
    const categoryIds = categoryBreakdown.map(cat => cat.categoryId).filter(id => id !== null)
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds as string[] } },
      select: { id: true, name: true }
    })
    
    const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]))

    // Get top sellers
    const topSellers = await prisma.product.groupBy({
      by: ['sellerId'],
      _count: { sellerId: true },
      orderBy: { _count: { sellerId: 'desc' } },
      take: 5
    })

    const topSellerDetails = await Promise.all(
      topSellers.map(async (seller) => {
        const user = await prisma.user.findUnique({
          where: { id: seller.sellerId },
          select: { firstName: true, lastName: true, email: true }
        })
        return {
          ...seller,
          userName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
          email: user?.email
        }
      })
    )

    // Get recent admin activities
    const recentActivities = await prisma.adminAuditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          }
        }
      }
    })

    return NextResponse.json({
      overview: {
        users: {
          total: totalUsers,
          last30Days: usersLast30Days,
          last7Days: usersLast7Days,
          today: usersToday,
          growth: userGrowth
        },
        products: {
          total: totalProducts,
          last30Days: productsLast30Days,
          active: activeProducts,
          categoryBreakdown: categoryBreakdown.map(cat => ({
            category: cat.categoryId ? categoryMap.get(cat.categoryId) || 'Unknown' : 'Uncategorized',
            count: cat._count.categoryId
          }))
        },
        orders: {
          total: totalOrders,
          last30Days: ordersLast30Days,
          totalRevenue: totalRevenue._sum.total || 0
        },
        engagement: {
          totalMessages: totalMessages,
          messagesLast7Days: messagesLast7Days,
          totalReviews: totalReviews,
          averageRating: avgRating._avg.rating || 0
        },
        pending: {
          verifications: pendingVerifications,
          supportMessages: unreadSupport
        },
        topSellers: topSellerDetails,
        recentActivities: recentActivities.map(activity => ({
          id: activity.id,
          action: activity.action,
          targetType: activity.targetType,
          adminName: activity.admin ? 
            `${activity.admin.user.firstName || ''} ${activity.admin.user.lastName || ''}`.trim() : 
            'Unknown',
          createdAt: activity.createdAt
        }))
      }
    })
  } catch (error) {
    console.error('Reports overview error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports overview' },
      { status: 500 }
    )
  }
}
