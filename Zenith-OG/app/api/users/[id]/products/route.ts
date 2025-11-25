import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    // Fetch user's active products
    const products = await prisma.product.findMany({
      where: {
        sellerId: userId,
        status: {
          in: ['active', 'pending']
        }
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        condition: true,
        status: true,
        available: true,
        images: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse images JSON for each product
    const formattedProducts = products.map(product => {
      let images: string[] = []
      if (product.images) {
        try {
          images = JSON.parse(product.images as string)
        } catch (e) {
          images = []
        }
      }

      return {
        ...product,
        images
      }
    })

    return NextResponse.json({ products: formattedProducts })
  } catch (error) {
    console.error('Error fetching user products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
