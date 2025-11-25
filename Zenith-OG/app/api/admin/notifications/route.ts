export const dynamic = 'force-dynamic'
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

    // Get pending verification notifications
    const pendingVerifications = await prisma.user.findMany({
      where: {
        documentsUploaded: true,
        adminVerified: false
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        university: true,
        createdAt: true,
        updatedAt: true,
        profilePicture: true,
        studentCardImage: true,
        idDocumentImage: true
      },
      orderBy: { updatedAt: 'desc' }
    })

    // Get pending product verifications
    const pendingProducts = await prisma.product.findMany({
      where: {
        status: 'pending',
        adminApproved: false
      },
      include: {
        seller: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get unread support messages
    const supportMessages = await prisma.supportMessage.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // Group support messages by priority
    const urgentSupport = supportMessages.filter(msg => msg.priority === 'urgent')
    const highSupport = supportMessages.filter(msg => msg.priority === 'high')
    const normalSupport = supportMessages.filter(msg => msg.priority === 'normal')
    const lowSupport = supportMessages.filter(msg => msg.priority === 'low')

    return NextResponse.json({
      notifications: {
        pendingVerifications: pendingVerifications.map(user => ({
          type: 'verification',
          id: user.id,
          userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
          email: user.email,
          university: user.university,
          submittedAt: user.updatedAt,
          hasDocuments: {
            profilePicture: !!user.profilePicture,
            studentCard: !!user.studentCardImage,
            idDocument: !!user.idDocumentImage
          }
        })),
        pendingProducts: pendingProducts.map(product => ({
          type: 'product_verification',
          id: product.id,
          title: product.title,
          price: product.price,
          sellerName: `${product.seller.firstName || ''} ${product.seller.lastName || ''}`.trim(),
          sellerEmail: product.seller.email,
          category: product.category.name,
          condition: product.condition,
          submittedAt: product.createdAt,
          image: product.image
        })),
        supportMessages: {
          urgent: urgentSupport.map(msg => ({
            type: 'support',
            id: msg.id,
            subject: msg.subject,
            name: msg.name,
            email: msg.email,
            category: msg.category,
            priority: msg.priority,
            message: msg.message.substring(0, 100) + '...',
            createdAt: msg.createdAt,
            read: msg.read
          })),
          high: highSupport.map(msg => ({
            type: 'support',
            id: msg.id,
            subject: msg.subject,
            name: msg.name,
            email: msg.email,
            category: msg.category,
            priority: msg.priority,
            message: msg.message.substring(0, 100) + '...',
            createdAt: msg.createdAt,
            read: msg.read
          })),
          normal: normalSupport.map(msg => ({
            type: 'support',
            id: msg.id,
            subject: msg.subject,
            name: msg.name,
            email: msg.email,
            category: msg.category,
            priority: msg.priority,
            message: msg.message.substring(0, 100) + '...',
            createdAt: msg.createdAt,
            read: msg.read
          })),
          low: lowSupport.map(msg => ({
            type: 'support',
            id: msg.id,
            subject: msg.subject,
            name: msg.name,
            email: msg.email,
            category: msg.category,
            priority: msg.priority,
            message: msg.message.substring(0, 100) + '...',
            createdAt: msg.createdAt,
            read: msg.read
          }))
        },
        summary: {
          totalPendingVerifications: pendingVerifications.length,
          totalPendingProducts: pendingProducts.length,
          totalSupportMessages: supportMessages.length,
          urgentCount: urgentSupport.length,
          highCount: highSupport.length,
          normalCount: normalSupport.length,
          lowCount: lowSupport.length
        }
      }
    })
  } catch (error) {
    console.error('Notifications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}
