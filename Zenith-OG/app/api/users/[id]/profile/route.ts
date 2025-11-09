import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    // Fetch user profile with stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        university: true,
        verified: true,
        documentsUploaded: true,
        createdAt: true,
        products: {
          select: {
            id: true,
            status: true,
            available: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate stats
    const totalListings = user.products.length
    const activeListings = user.products.filter(
      (p: any) => p.available && p.status === 'active'
    ).length
    const soldItems = user.products.filter((p: any) => p.status === 'sold').length

    // Calculate average rating
    const totalRating = user.reviews.reduce((sum: number, review: any) => sum + review.rating, 0)
    const averageRating = user.reviews.length > 0 
      ? totalRating / user.reviews.length 
      : 0

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email

    const profile = {
      id: user.id,
      name: fullName,
      email: user.email,
      avatar: user.avatar,
      university: user.university,
      verified: user.verified,
      documentsUploaded: user.documentsUploaded,
      createdAt: user.createdAt.toISOString(),
      stats: {
        totalListings,
        activeListings,
        soldItems,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: user.reviews.length
      }
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
