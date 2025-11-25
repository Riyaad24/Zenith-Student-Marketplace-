export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    let decoded: any

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const userId = decoded.userId

    // Count unread notifications for the user
    const unreadCount = await prisma.notification.count({
      where: {
        userId: userId,
        read: false
      }
    })

    return NextResponse.json({ 
      count: unreadCount,
      success: true 
    })

  } catch (error) {
    console.error('Error fetching unread notification count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch unread notification count' },
      { status: 500 }
    )
  }
}
