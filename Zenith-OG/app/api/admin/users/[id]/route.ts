export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdminAuth } from '@/middleware/adminAuth'
import { hasPermission, ADMIN_PERMISSIONS, getClientIP } from '@/lib/admin-auth'
import { auditLog } from '@/lib/audit'

// GET /api/admin/users/[id] - Get specific user details
async function handleUserGet(
  request: NextRequest,
  authResult: any,
  { params }: { params: { id: string } }
) {
  try {
    const admin = authResult.admin
    if (!hasPermission(admin, ADMIN_PERMISSIONS.USERS_READ)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        roleAssignments: {
          include: { role: true }
        },
        admin: true,
        security: {
          select: {
            lastLogin: true,
            emailVerified: true,
            accountLocked: true,
            failedLoginAttempts: true,
            lastPasswordChange: true
          }
        },
        products: {
          select: {
            id: true,
            title: true,
            price: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            products: true,
            orders: true,
            reviews: true,
            sentMessages: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Log view action for audit
    await auditLog(authResult.adminId, params.id, 'VIEW_USER', null, getClientIP(request))

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        university: user.university,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        verified: user.verified,
        profilePicture: user.profilePicture,
        studentCardImage: user.studentCardImage,
        idDocumentImage: user.idDocumentImage,
        documentsUploaded: user.documentsUploaded,
        adminVerified: user.adminVerified,
        verificationNotes: user.verificationNotes,
        verifiedAt: user.verifiedAt,
        isAdmin: !!user.admin,
        roles: user.roleAssignments.map(ra => ra.role.name),
        security: user.security,
        recentProducts: user.products,
        recentOrders: user.orders,
        counts: user._count,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
  } catch (error) {
    console.error('Admin get user error:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// PUT /api/admin/users/[id] - Update user
async function handleUserPut(
  request: NextRequest,
  authResult: any,
  { params }: { params: { id: string } }
) {
  try {
    const admin = authResult.admin
    if (!hasPermission(admin, ADMIN_PERMISSIONS.USERS_UPDATE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updateData = await request.json()
    
    // Get current user data for audit log
    const currentUser = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        security: true,
        roleAssignments: {
          include: { role: true }
        }
      }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      // Update user profile
      const user = await tx.user.update({
        where: { id: params.id },
        data: {
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          university: updateData.university,
          phone: updateData.phone,
          location: updateData.location,
          bio: updateData.bio,
          verified: updateData.verified,
          adminVerified: updateData.adminVerified,
          verificationNotes: updateData.verificationNotes,
          verifiedAt: updateData.adminVerified && !currentUser.adminVerified ? new Date() : currentUser.verifiedAt
        },
        include: {
          roleAssignments: {
            include: { role: true }
          }
        }
      })

      // Update security settings if provided
      if (updateData.accountLocked !== undefined) {
        await tx.accountSecurity.update({
          where: { userId: params.id },
          data: {
            accountLocked: updateData.accountLocked,
            lockedUntil: updateData.accountLocked ? null : undefined,
            failedLoginAttempts: updateData.accountLocked ? 0 : undefined
          }
        })
      }

      // Send notification if user was just verified
      if (updateData.adminVerified && !currentUser.adminVerified) {
        await tx.notification.create({
          data: {
            userId: params.id,
            type: 'verification_approved',
            title: '✅ Account Verified!',
            message: 'Congratulations! Your verification documents have been reviewed and approved by our admin team. Your account is now fully verified and you have access to all marketplace features.',
            read: false
          }
        })
      }

      return user
    })

    // Log admin action
    await auditLog(authResult.adminId, params.id, 'UPDATE_USER', null, getClientIP(request))

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        university: updatedUser.university,
        verified: updatedUser.verified,
        roles: updatedUser.roleAssignments.map(ra => ra.role.name)
      },
      message: 'User updated successfully'
    })
  } catch (error) {
    console.error('Admin update user error:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE /api/admin/users/[id] - Delete user
async function handleUserDelete(
  request: NextRequest,
  authResult: any,
  { params }: { params: { id: string } }
) {
  try {
    const admin = authResult.admin
    if (!hasPermission(admin, ADMIN_PERMISSIONS.USERS_DELETE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get user data for audit log before deletion
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        verified: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent deleting other admin users
    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
      include: { admin: true }
    })

    if (targetUser?.admin && targetUser.id !== authResult.admin.id) {
      return NextResponse.json({ error: 'Cannot delete other admin users' }, { status: 403 })
    }

    // Delete related records first to avoid foreign key constraint errors
    await prisma.$transaction(async (tx) => {
      // Delete user's products and related data
      await tx.review.deleteMany({ where: { userId: params.id } })
      await tx.wishlistItem.deleteMany({ where: { userId: params.id } })
      await tx.cartItem.deleteMany({ where: { userId: params.id } })
      await tx.notification.deleteMany({ where: { userId: params.id } })
      await tx.address.deleteMany({ where: { userId: params.id } })
      
      // Delete messages
      await tx.message.deleteMany({
        where: {
          OR: [
            { senderId: params.id },
            { receiverId: params.id }
          ]
        }
      })
      
      // Delete orders
      await tx.order.deleteMany({ where: { userId: params.id } })
      
      // Delete products
      await tx.product.deleteMany({ where: { sellerId: params.id } })
      
      // Delete security-related records
      await tx.securityAuditLog.deleteMany({ where: { userId: params.id } })
      await tx.dataAccessLog.deleteMany({ where: { userId: params.id } })
      await tx.userSession.deleteMany({ where: { userId: params.id } })
      await tx.accountSecurity.deleteMany({ where: { userId: params.id } })
      
      // Delete admin record if exists
      await tx.admin.deleteMany({ where: { userId: params.id } })
      
      // Delete role assignments (should cascade but delete explicitly for safety)
      await tx.userRoleAssignment.deleteMany({ where: { userId: params.id } })
      
      // Finally delete the user
      await tx.user.delete({
        where: { id: params.id }
      })
    })

    // Log admin action
    await auditLog(authResult.adminId, params.id, 'DELETE_USER', null, getClientIP(request))

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Admin delete user error:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}

export const GET = withAdminAuth(handleUserGet)
export const PUT = withAdminAuth(handleUserPut)
export const DELETE = withAdminAuth(handleUserDelete)