import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// GET - Fetch a specific support message
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const message = await prisma.supportMessage.findUnique({
      where: { id: params.id }
    })

    if (!message) {
      return NextResponse.json({ error: 'Support message not found' }, { status: 404 })
    }

    // Mark as read
    if (!message.read) {
      await prisma.supportMessage.update({
        where: { id: params.id },
        data: { read: true }
      })
    }

    return NextResponse.json({ message: { ...message, read: true } })
  } catch (error) {
    console.error('Fetch support message error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch support message' },
      { status: 500 }
    )
  }
}

// PUT - Update support message (respond, change status, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json()
    const { status, priority, adminResponse } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (adminResponse) {
      updateData.adminResponse = adminResponse
      updateData.respondedBy = admin.id
      updateData.respondedAt = new Date()
    }

    const updatedMessage = await prisma.supportMessage.update({
      where: { id: params.id },
      data: updateData
    })

    // Log admin action
    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE_SUPPORT_MESSAGE',
        targetType: 'SUPPORT',
        targetId: params.id,
        newValues: updateData,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || null
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: updatedMessage 
    })
  } catch (error) {
    console.error('Update support message error:', error)
    return NextResponse.json(
      { error: 'Failed to update support message' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a support message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await prisma.supportMessage.delete({
      where: { id: params.id }
    })

    // Log admin action
    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.id,
        action: 'DELETE_SUPPORT_MESSAGE',
        targetType: 'SUPPORT',
        targetId: params.id,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete support message error:', error)
    return NextResponse.json(
      { error: 'Failed to delete support message' },
      { status: 500 }
    )
  }
}
