export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdminAuth } from '@/middleware/adminAuth'
import { hasPermission, ADMIN_PERMISSIONS, getClientIP } from '@/lib/admin-auth'
import { auditLog } from '@/lib/audit'

// DELETE /api/admin/products/[id] - Delete product (admin action)
async function handleProductDelete(
  request: NextRequest,
  authResult: any,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = authResult.admin
    
    // Check if admin has permission to delete products
    if (!hasPermission(admin, ADMIN_PERMISSIONS.PRODUCTS_DELETE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Await params as per Next.js 15+ requirements
    const { id } = await params

    // Get product data for audit log before deletion
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        sellerId: true,
        status: true
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete the product
    await prisma.product.delete({
      where: { id }
    })

    // Log admin action
    await auditLog(
      authResult.adminId,
      id,
      'DELETE_PRODUCT',
      JSON.stringify({ productTitle: product.title, sellerId: product.sellerId }),
      getClientIP(request)
    )

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Admin delete product error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

export const DELETE = withAdminAuth(handleProductDelete)
