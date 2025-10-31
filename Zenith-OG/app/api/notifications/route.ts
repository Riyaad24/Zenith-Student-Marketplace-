import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '@/lib/config'
import { prisma } from '@/lib/prisma'

// Get notifications for the authenticated user
export async function GET(req: NextRequest) {
  try {
    // Get the token from the Authorization header
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || 
                  req.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret) as { userId: string }
    
    if (!decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    
    const skip = (page - 1) * limit

    // Build the where clause
    const where: any = {
      userId: decoded.userId
    }

    if (unreadOnly) {
      where.read = false
    }

    // Get notifications for the user
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // Get total count for pagination
    const totalCount = await prisma.notification.count({
      where
    })

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Mark notification as read
export async function PATCH(req: NextRequest) {
  try {
    // Get the token from the Authorization header
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || 
                  req.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret) as { userId: string }
    
    if (!decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await req.json()
    const { notificationId, markAllAsRead } = body

    if (markAllAsRead) {
      // Mark all notifications as read for the user
      await prisma.notification.updateMany({
        where: {
          userId: decoded.userId,
          read: false
        },
        data: {
          read: true
        }
      })

      return NextResponse.json({ message: 'All notifications marked as read' })
    } else if (notificationId) {
      // Mark specific notification as read
      const notification = await prisma.notification.update({
        where: {
          id: notificationId,
          userId: decoded.userId // Ensure user can only update their own notifications
        },
        data: {
          read: true
        }
      })

      return NextResponse.json(notification)
    } else {
      return NextResponse.json({ error: 'notificationId or markAllAsRead is required' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create a new notification (for testing or system use)
export async function POST(req: NextRequest) {
  try {
    // Get the token from the Authorization header
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || 
                  req.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret) as { userId: string }
    
    if (!decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await req.json()
    const { type, title, message, metadata, userId } = body

    // For demo purposes, allow creating notifications for the authenticated user
    // In production, this would typically be done by the system, not by users
    const targetUserId = userId || decoded.userId

    const notification = await prisma.notification.create({
      data: {
        type: type || 'system',
        title,
        message,
        metadata,
        userId: targetUserId
      }
    })

    return NextResponse.json(notification, { status: 201 })

  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
