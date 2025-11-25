import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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

    // Calculate average rating for each product, format seller name, and parse images
    const productsWithRating = products.map((product: any) => {
      // Parse images
      let imageArray = []
      
      // First, try to parse the images field (which contains the full array)
      if (product.images) {
        try {
          const parsedImages = JSON.parse(product.images)
          if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            imageArray = parsedImages
          }
        } catch (e) {
          console.error('Failed to parse product images:', e)
        }
      }
      
      // If no images from the images field, try the image field
      if (imageArray.length === 0 && product.image) {
        imageArray.push(product.image)
      }
      
      // Fallback to placeholder
      if (imageArray.length === 0) {
        imageArray = ['/placeholder.svg?height=300&width=200&text=No+Image']
      }

      return {
        ...product,
        images: imageArray,
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
      }
    })

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
    console.log('📝 Product creation request received')
    
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      console.error('❌ Unauthorized: No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ User authenticated:', user.email)

    // Parse request body
    const body = await request.json()
    console.log('📦 Request body:', JSON.stringify(body, null, 2))
    
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
      pdfFile,
      contactPreferences
    } = body

    // Validate required fields
    if (!title || !description || !price || !quantity || !category || !condition) {
      console.error('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      console.error('❌ Invalid quantity:', quantity)
      return NextResponse.json(
        { error: 'Quantity must be a positive integer' },
        { status: 400 }
      )
    }

    if (!images || images.length === 0) {
      console.error('❌ No images provided')
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      )
    }

    console.log('✅ All validations passed')

    // Get or create category
    let productCategory = await prisma.category.findFirst({
      where: { slug: category }
    })

    if (!productCategory) {
      console.log('📁 Creating new category:', category)
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

    console.log('📁 Category ID:', productCategory.id)

    // Create the product
    console.log('🔨 Creating product...')
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        quantity,
        condition,
        location: `${city || ''} ${campus || ''}`.trim(),
        university: campus || '',
        images: JSON.stringify(images), // Store as JSON string
        pdfFile: pdfFile || null, // Store PDF URL if provided
        status: 'pending', // Changed to pending - requires admin approval
        adminApproved: false,
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

    console.log('✅ Product created:', product.id)

    console.log('🔔 Creating notifications...')
    // Create notification for user about listing review
    await prisma.notification.create({
      data: {
        userId: user.userId,
        type: 'listing_submitted',
        title: '📝 Listing Submitted for Review',
        message: `Your listing "${title}" has been submitted successfully! Our admin team will review it shortly. You'll be notified once it's approved and live on Zenith.`,
        read: false,
        metadata: { productId: product.id, productTitle: title }
      }
    })

    // Create notifications for all active admins about the new listing
    const activeAdmins = await prisma.admin.findMany({
      where: { isActive: true },
      select: { userId: true }
    })

    console.log(`📧 Sending notifications to ${activeAdmins.length} admins`)

    if (activeAdmins.length > 0) {
      await prisma.notification.createMany({
        data: activeAdmins.map(admin => ({
          userId: admin.userId,
          type: 'listing_approval',
          title: '🆕 New Listing Awaiting Approval',
          message: `A new product "${title}" has been submitted and requires your review. Go to Products Verification to review and approve.`,
          read: false,
          metadata: { productId: product.id, productTitle: title, sellerEmail: user.email }
        }))
      })
    }

    console.log('✅ Product listing process complete!')

    return NextResponse.json({
      success: true,
      id: product.id,
      product,
      message: 'Listing submitted successfully! Admin will review your product before it goes live.'
    })

  } catch (error) {
    console.error('❌ Error creating product:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Stack trace:', error instanceof Error ? error.stack : '')
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}