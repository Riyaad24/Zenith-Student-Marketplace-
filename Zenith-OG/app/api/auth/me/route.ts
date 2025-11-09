import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    console.log('🔍 API /auth/me - Cookie present:', !!token)
    console.log('🔍 API /auth/me - Token length:', token?.length || 0)
    console.log('🔍 API /auth/me - All cookies:', cookieStore.getAll().map(c => c.name))

    if (!token) {
      console.log('❌ API /auth/me - No token found in cookies')
      return NextResponse.json({ error: 'No auth token' }, { status: 401 })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, jwtSecret) as any
    console.log('✅ API /auth/me - Token decoded for user:', decoded.userId)
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        university: true,
        verified: true
      }
    })

    if (!user) {
      console.log('❌ API /auth/me - User not found in database')
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    console.log('✅ API /auth/me - Returning user:', user.email)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        university: user.university,
        verified: user.verified
      }
    })

  } catch (error) {
    console.error('❌ API /auth/me - Error:', error)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}