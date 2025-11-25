export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    console.log('Profile API: Token exists?', !!token)

    if (!token) {
      console.log('Profile API: No auth token found')
      return NextResponse.json({ error: 'No auth token' }, { status: 401 })
    }

    // Verify JWT token
    let decoded
    try {
      decoded = jwt.verify(token, jwtSecret) as any
      console.log('Profile API: Token verified, userId:', decoded.userId)
    } catch (jwtError) {
      console.error('Profile API: JWT verification failed:', jwtError)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Get user with profile data
    console.log('Profile API: Fetching user from database...')
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
        admin: {
          select: {
            id: true,
            isActive: true
          }
        },
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
        },
        security: {
          select: {
            emailVerified: true
          }
        }
      }
    })

    if (!user) {
      console.log('Profile API: User not found in database for userId:', decoded.userId)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('Profile API: User found:', user.email)

    // Calculate stats - with safe defaults
    const activeListings = user.products?.filter(p => p.status === 'active').length || 0
    const totalListings = user.products?.length || 0
    const completedOrders = user.orders?.filter(o => o.status === 'completed').length || 0

    // Format joined date
    const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })

    console.log('Profile API: Returning success response')

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
        isAdmin: !!(user.admin?.isActive), // Check if user is an active admin
        // Verification data
        profilePicture: user.profilePicture,
        studentCardImage: user.studentCardImage,
        idDocumentImage: user.idDocumentImage,
        documentsUploaded: user.documentsUploaded,
        adminVerified: user.adminVerified,
        verificationNotes: user.verificationNotes,
        verifiedAt: user.verifiedAt,
        security: {
          emailVerified: user.security?.emailVerified || false
        },
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
    const decoded = jwt.verify(token, jwtSecret) as any
    
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
