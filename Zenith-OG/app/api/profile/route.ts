import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No auth token' }, { status: 401 })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
    
    // Get user with profile data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        phone: true,
        university: true,
        location: true,
        bio: true,
        verified: true,
        createdAt: true,
        // Verification fields
        profilePicture: true,
        studentCardImage: true,
        idDocumentImage: true,
        documentsUploaded: true,
        adminVerified: true,
        verificationNotes: true,
        verifiedAt: true,
        products: {
          select: {
            id: true,
            status: true
          }
        },
        orders: {
          select: {
            id: true,
            status: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Calculate stats
    const activeListings = user.products.filter(p => p.status === 'active').length
    const totalListings = user.products.length
    const completedOrders = user.orders.filter(o => o.status === 'completed').length

    // Format joined date
    const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        phone: user.phone,
        university: user.university,
        location: user.location,
        bio: user.bio,
        verified: user.verified,
        joinedDate,
        // Verification data
        profilePicture: user.profilePicture,
        studentCardImage: user.studentCardImage,
        idDocumentImage: user.idDocumentImage,
        documentsUploaded: user.documentsUploaded,
        adminVerified: user.adminVerified,
        verificationNotes: user.verificationNotes,
        verifiedAt: user.verifiedAt,
        stats: {
          listings: activeListings,
          totalListings,
          sales: completedOrders,
          rating: 4.8 // TODO: Calculate actual rating from reviews
        }
      }
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No auth token' }, { status: 401 })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
    
    const body = await request.json()
    const { firstName, lastName, university, location, bio, phone } = body

    // Update user profile
    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        firstName,
        lastName,
        university,
        location,
        bio,
        phone
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        phone: true,
        university: true,
        location: true,
        bio: true,
        verified: true
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        phone: user.phone,
        university: user.university,
        location: user.location,
        bio: user.bio,
        verified: user.verified
      }
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}