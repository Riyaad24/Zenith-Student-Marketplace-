import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdminAuth } from '@/middleware/adminAuth'
import { hasPermission, ADMIN_PERMISSIONS, getClientIP } from '@/lib/admin-auth'
import { auditLog } from '@/lib/audit'

// GET /api/admin/products - List products with filters
async function handleProductsGet(
  request: NextRequest,
  authResult: any
) {
  try {
    const admin = authResult.admin
    if (!hasPermission(admin, ADMIN_PERMISSIONS.PRODUCTS_READ)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status !== 'all') {
      where.status = status
    }

    // Fetch products with seller and category info
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              university: true
            }
          },
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    // Log access
    await auditLog(authResult.adminId, null, 'VIEW_PRODUCTS', `status=${status}`, getClientIP(request))

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Admin products list error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export const GET = withAdminAuth(handleProductsGet)
