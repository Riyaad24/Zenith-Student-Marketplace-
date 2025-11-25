export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// GET - Fetch all support messages
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const admin = await prisma.admin.findFirst({
      where: { userId: decoded.userId, isActive: true }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')

    const where: any = {}
    if (status) where.status = status
    if (priority) where.priority = priority
    if (category) where.category = category

    const messages = await prisma.supportMessage.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Support messages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch support messages' },
      { status: 500 }
    )
  }
}

// POST - Create a new support message (can be called by users)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, email, subject, message, category, priority } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    const supportMessage = await prisma.supportMessage.create({
      data: {
        userId: userId || null,
        name,
        email,
        subject,
        message,
        category: category || 'general',
        priority: priority || 'normal',
        status: 'pending',
        read: false
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Support request submitted successfully',
      supportMessage 
    })
  } catch (error) {
    console.error('Create support message error:', error)
    return NextResponse.json(
      { error: 'Failed to submit support request' },
      { status: 500 }
    )
  }
}
