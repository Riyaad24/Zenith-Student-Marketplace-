import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdminAuth } from '@/middleware/adminAuth'
import { hasPermission, ADMIN_PERMISSIONS, getClientIP } from '@/lib/admin-auth'
import { auditLog } from '@/lib/audit'

// PUT /api/admin/products/[id]/verify - Approve or reject product
async function handleProductVerify(
  request: NextRequest,
  authResult: any,
  { params }: { params: { id: string } }
) {
  try {
    const admin = authResult.admin
    if (!hasPermission(admin, ADMIN_PERMISSIONS.PRODUCTS_UPDATE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { approved, rejectionReason, verificationNotes } = await request.json()

    // Get product and seller info
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Update product status
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        status: approved ? 'active' : 'rejected',  // Changed from 'approved' to 'active'
        adminApproved: approved,
        approvedBy: approved ? authResult.adminId : null,
        approvedAt: approved ? new Date() : null,
        rejectionReason: approved ? null : rejectionReason,
        verificationNotes: verificationNotes || null
      }
    })

    // Create notification for seller
    const notificationMessage = approved
      ? `✓ Product Approved! Your listing "${product.title}" has been approved and is now live on Zenith.`
      : `✗ Product Not Approved. Your listing "${product.title}" was not approved. Reason: ${rejectionReason}`

    await prisma.notification.create({
      data: {
        userId: product.sellerId,
        type: approved ? 'product_approved' : 'product_rejected',
        title: approved ? 'Product Approved' : 'Product Not Approved',
        message: notificationMessage,
        metadata: {
          productId: product.id,
          link: `/product/${product.id}`
        },
        read: false
      }
    })

    // Log admin action
    await auditLog(
      authResult.adminId,
      params.id,
      approved ? 'APPROVE_PRODUCT' : 'REJECT_PRODUCT',
      rejectionReason || null,
      getClientIP(request)
    )

    return NextResponse.json({
      success: true,
      message: approved ? 'Product approved successfully' : 'Product rejected',
      product: updatedProduct
    })
  } catch (error) {
    console.error('Product verification error:', error)
    return NextResponse.json({ error: 'Failed to verify product' }, { status: 500 })
  }
}

export const PUT = withAdminAuth(handleProductVerify)
