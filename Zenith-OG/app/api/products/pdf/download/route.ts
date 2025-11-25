import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib'

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

async function watermarkPDF(pdfBuffer: Buffer, watermarkText: string): Promise<Buffer> {
  try {
    // Load the PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    const pages = pdfDoc.getPages()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Add watermark to each page
    for (const page of pages) {
      const { width, height } = page.getSize()
      const fontSize = 10
      const textWidth = font.widthOfTextAtSize(watermarkText, fontSize)

      // Add watermark at bottom right
      page.drawText(watermarkText, {
        x: width - textWidth - 20,
        y: 15,
        size: fontSize,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.5,
      })

      // Add watermark diagonally across the page (subtle)
      page.drawText(watermarkText, {
        x: width / 2 - textWidth / 2,
        y: height / 2,
        size: 40,
        font: font,
        color: rgb(0.9, 0.9, 0.9),
        opacity: 0.1,
        rotate: degrees(45),
      })
    }

    // Save the watermarked PDF
    const watermarkedPdfBytes = await pdfDoc.save()
    return Buffer.from(watermarkedPdfBytes)
  } catch (error) {
    console.error('Error watermarking PDF:', error)
    // If watermarking fails, return original PDF
    return pdfBuffer
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
        return NextResponse.json({ error: 'You must purchase this product to access the PDF' }, { status: 403 })
      }
    }

    // Get user details for watermark
    const userProfile = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        email: true,
        firstName: true,
        lastName: true
      }
    })

    // Read the PDF file
    const pdfPath = join(process.cwd(), 'public', product.pdfFile)
    const pdfBuffer = await readFile(pdfPath)

    // Create watermark text
    const watermarkText = `Downloaded by: ${userProfile?.email || user.email} | ${new Date().toLocaleString()}`

    // Add watermark to PDF
    const watermarkedPdf = await watermarkPDF(pdfBuffer, watermarkText)

    // Return the watermarked PDF
    return new NextResponse(watermarkedPdf as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${product.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
      },
    })

  } catch (error) {
    console.error('Error downloading PDF:', error)
    return NextResponse.json(
      { error: 'Failed to download PDF' },
      { status: 500 }
    )
  }
}
