import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all categories
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: {
              where: {
                status: 'active'
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Get unique locations
    const locationResults = await prisma.product.findMany({
      where: {
        status: 'active',
        location: {
          not: null
        }
      },
      select: {
        location: true
      },
      distinct: ['location']
    })
    
    const locations = locationResults
      .map((item: any) => item.location)
      .filter(Boolean)
      .sort()

    // Get unique universities
    const universityResults = await prisma.product.findMany({
      where: {
        status: 'active',
        university: {
          not: null
        }
      },
      select: {
        university: true
      },
      distinct: ['university']
    })
    
    const universities = universityResults
      .map((item: any) => item.university)
      .filter(Boolean)
      .sort()

    // Get price range
    const priceRange = await prisma.product.aggregate({
      where: {
        status: 'active'
      },
      _min: {
        price: true
      },
      _max: {
        price: true
      }
    })

    // Get available conditions
    const conditionResults = await prisma.product.findMany({
      where: {
        status: 'active'
      },
      select: {
        condition: true
      },
      distinct: ['condition']
    })
    
    const conditions = conditionResults
      .map((item: any) => item.condition)
      .filter(Boolean)
      .sort()

    return NextResponse.json({
      categories: categories.map((cat: any) => ({
        ...cat,
        productCount: cat._count.products
      })),
      locations,
      universities,
      conditions,
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 10000
      }
    })

  } catch (error) {
    console.error('Error fetching filter options:', error)
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    )
  }
}