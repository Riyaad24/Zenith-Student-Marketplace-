import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            university: true,
            verified: true,
            adminVerified: true,
            documentsUploaded: true,
            createdAt: true,
            profilePicture: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Calculate seller rating from reviews
    const sellerProducts = await prisma.product.findMany({
      where: { sellerId: product.sellerId },
      include: {
        reviews: true
      }
    })

    const allReviews = sellerProducts.flatMap(p => p.reviews)
    const averageRating = allReviews.length > 0
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
      : 0

    // Format joined date
    const joinedDate = new Date(product.seller.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })

    // Parse images
    let images = []
    if (product.image) {
      images.push(product.image)
    }
    if (product.images) {
      try {
        const additionalImages = JSON.parse(product.images)
        if (Array.isArray(additionalImages)) {
          images = [...images, ...additionalImages]
        }
      } catch (e) {
        // If parsing fails, just use the main image
      }
    }

    // Format response
    const formattedProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      condition: product.condition,
      status: product.status,
      available: product.available,
      location: product.location,
      university: product.university,
      images: images.length > 0 ? images : ['/placeholder.svg?height=500&width=500&text=No+Image'],
      pdfFile: product.pdfFile || null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: product.category,
      seller: {
        id: product.seller.id,
        name: `${product.seller.firstName || ''} ${product.seller.lastName || ''}`.trim() || 'Anonymous',
        email: product.seller.email,
        avatar: product.seller.profilePicture || product.seller.avatar,
        university: product.seller.university,
        verified: product.seller.adminVerified || product.seller.verified,
        documentsUploaded: product.seller.documentsUploaded,
        rating: Math.round(averageRating * 10) / 10,
        joinedDate: joinedDate
      },
      reviews: product.reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        user: {
          id: review.user.id,
          name: `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || 'Anonymous',
          avatar: review.user.avatar
        }
      }))
    }

    return NextResponse.json({ product: formattedProduct })

  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
