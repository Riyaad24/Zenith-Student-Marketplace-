import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '@/lib/config'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret) as { userId: string }
    
    if (!decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get wishlist items for the user with product details
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        userId: decoded.userId
      },
      include: {
        product: {
          include: {
            category: true,
            seller: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match frontend expectations
    const formattedWishlist = wishlistItems.map(item => ({
      id: item.id,
      addedAt: item.createdAt,
      product: {
        id: item.product.id,
        title: item.product.title,
        description: item.product.description,
        price: item.product.price,
        image: item.product.image,
        condition: item.product.condition,
        status: item.product.status,
        available: item.product.available,
        location: item.product.location,
        university: item.product.university,
        createdAt: item.product.createdAt,
        category: item.product.category,
        seller: {
          id: item.product.seller.id,
          name: item.product.seller.firstName && item.product.seller.lastName
            ? `${item.product.seller.firstName} ${item.product.seller.lastName}`
            : item.product.seller.email,
          avatar: item.product.seller.avatar
        }
      }
    }))

    return NextResponse.json({
      wishlist: formattedWishlist,
      count: formattedWishlist.length
    })

  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Add product to wishlist
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
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if item is already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: decoded.userId,
          productId: productId
        }
      }
    })

    if (existingItem) {
      return NextResponse.json({ error: 'Product already in wishlist' }, { status: 409 })
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: decoded.userId,
        productId: productId
      },
      include: {
        product: {
          include: {
            category: true,
            seller: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true
              }
            }
          }
        }
      }
    })

    // Format the response
    const formattedItem = {
      id: wishlistItem.id,
      addedAt: wishlistItem.createdAt,
      product: {
        id: wishlistItem.product.id,
        title: wishlistItem.product.title,
        description: wishlistItem.product.description,
        price: wishlistItem.product.price,
        image: wishlistItem.product.image,
        condition: wishlistItem.product.condition,
        status: wishlistItem.product.status,
        available: wishlistItem.product.available,
        location: wishlistItem.product.location,
        university: wishlistItem.product.university,
        createdAt: wishlistItem.product.createdAt,
        category: wishlistItem.product.category,
        seller: {
          id: wishlistItem.product.seller.id,
          name: wishlistItem.product.seller.firstName && wishlistItem.product.seller.lastName
            ? `${wishlistItem.product.seller.firstName} ${wishlistItem.product.seller.lastName}`
            : wishlistItem.product.seller.email,
          avatar: wishlistItem.product.seller.avatar
        }
      }
    }

    return NextResponse.json(formattedItem, { status: 201 })

  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Remove product from wishlist
export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Remove from wishlist
    const deletedItem = await prisma.wishlistItem.deleteMany({
      where: {
        userId: decoded.userId,
        productId: productId
      }
    })

    if (deletedItem.count === 0) {
      return NextResponse.json({ error: 'Item not found in wishlist' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Product removed from wishlist' })

  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
