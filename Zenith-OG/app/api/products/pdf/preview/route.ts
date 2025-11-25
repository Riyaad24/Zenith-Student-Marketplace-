import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { PDFDocument } from 'pdf-lib'

const prisma = new PrismaClient()
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
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: {
          select: {
            id: true
          }
        }
      }
    })

    if (!product || !product.pdfFile) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
    }

    // Check if user is seller or has purchased
    const isSeller = user.userId === product.seller.id

    if (!isSeller) {
      // Check if user has purchased this product
      const hasPurchased = await prisma.order.findFirst({
        where: {
          userId: user.userId,
          status: 'completed',
          orderItems: {
            some: {
              productId: productId
            }
          }
        }
      })

      if (!hasPurchased) {
        // For preview, we allow anyone to see the first page
        // return NextResponse.json({ error: 'You must purchase this product to preview the PDF' }, { status: 403 })
      }
    }

    // Read the PDF file
    const pdfPath = join(process.cwd(), 'public', product.pdfFile)
    const pdfBuffer = await readFile(pdfPath)

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    
    // Create a new PDF with only the first page
    const previewDoc = await PDFDocument.create()
    const [firstPage] = await previewDoc.copyPages(pdfDoc, [0])
    previewDoc.addPage(firstPage)

    // Save the preview PDF
    const previewPdfBytes = await previewDoc.save()

    // Return the preview PDF (first page only)
    return new NextResponse(previewPdfBytes as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="preview.pdf"',
        'Cache-Control': 'no-store',
      },
    })

  } catch (error) {
    console.error('Error previewing PDF:', error)
    return NextResponse.json(
      { error: 'Failed to load PDF preview' },
      { status: 500 }
    )
  }
}
