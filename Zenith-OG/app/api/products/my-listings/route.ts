import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

interface JWTPayload {
  userId: string
  email: string
}

async function getAuthenticatedUser(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'active', 'sold', 'inactive', or 'all'

    // Build where clause
    const where: any = {
      sellerId: user.userId
    }

    if (status && status !== 'all') {
      where.status = status
    }

    // Get user's products
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: {
            reviews: true,
            wishlistItems: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format products with additional info
    const formattedProducts = products.map((product: any) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      image: product.images ? JSON.parse(product.images)[0] : product.image,
      images: product.images ? JSON.parse(product.images) : (product.image ? [product.image] : []),
      condition: product.condition,
      status: product.status,
      location: product.location,
      university: product.university,
      category: product.category,
      reviewCount: product._count.reviews,
      wishlistCount: product._count.wishlistItems,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      products: formattedProducts,
      count: formattedProducts.length
    })

  } catch (error) {
    console.error('Error fetching user listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Verify the product belongs to the user
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: user.userId
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete the product
    await prisma.product.delete({
      where: {
        id: productId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, status } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Verify the product belongs to the user
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: user.userId
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or unauthorized' },
        { status: 404 }
      )
    }

    // Update the product status
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        status: status || product.status
      }
    })

    return NextResponse.json({
      success: true,
      product: updatedProduct
    })

  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}
