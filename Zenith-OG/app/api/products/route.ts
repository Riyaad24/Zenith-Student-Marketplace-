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
    const token = cookieStore.get('token')?.value

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
    const { searchParams } = new URL(request.url)
    
    // Extract filter parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const condition = searchParams.get('condition')
    const location = searchParams.get('location')
    const university = searchParams.get('university')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {
      status: 'active'
    }

    if (category && category !== 'all') {
      where.category = {
        slug: category
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }

    if (condition && condition !== 'all') {
      where.condition = condition
    }

    if (location && location !== 'all') {
      where.location = {
        contains: location
      }
    }

    if (university && university !== 'all') {
      where.university = {
        contains: university
      }
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search
          }
        },
        {
          description: {
            contains: search
          }
        }
      ]
    }

    // Build orderBy clause
    const orderBy: any = {}
    if (sortBy === 'price') {
      orderBy.price = sortOrder
    } else if (sortBy === 'rating') {
      orderBy.reviews = {
        _avg: {
          rating: sortOrder
        }
      }
    } else {
      orderBy[sortBy] = sortOrder
    }

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          },
          _count: {
            select: {
              reviews: true
            }
          }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({
        where
      })
    ])

    // Calculate average rating for each product and format seller name
    const productsWithRating = products.map((product: any) => ({
      ...product,
      averageRating: product.reviews.length > 0 
        ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
        : 0,
      reviewCount: product._count.reviews,
      seller: {
        ...product.seller,
        name: product.seller.firstName && product.seller.lastName 
          ? `${product.seller.firstName} ${product.seller.lastName}`
          : product.seller.firstName || 'Anonymous User'
      }
    }))

    return NextResponse.json({
      success: true,
      products: productsWithRating,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const {
      title,
      description,
      price,
      quantity,
      category,
      condition,
      priceType,
      city,
      campus,
      images,
      contactPreferences
    } = body

    // Validate required fields
    if (!title || !description || !price || !quantity || !category || !condition) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be a positive integer' },
        { status: 400 }
      )
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      )
    }

    // Get or create category
    let productCategory = await prisma.category.findFirst({
      where: { slug: category }
    })

    if (!productCategory) {
      // Create category if it doesn't exist
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
      productCategory = await prisma.category.create({
        data: {
          name: categoryName,
          slug: category,
          description: `${categoryName} products`
        }
      })
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        quantity,
        condition,
        location: `${city || ''} ${campus || ''}`.trim(),
        university: campus || '',
        images: images,
        status: 'active',
        sellerId: user.userId,
        categoryId: productCategory.id,
      },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        category: true
      }
    })

    return NextResponse.json({
      success: true,
      id: product.id,
      product
    })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}