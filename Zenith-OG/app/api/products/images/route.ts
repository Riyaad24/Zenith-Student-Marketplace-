import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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

/**
 * Validates product image files
 */
function validateProductImage(file: File): {
  isValid: boolean
  error?: string
} {
  // Maximum file size: 10MB
  const maxSizeBytes = 10 * 1024 * 1024
  
  // Allowed image types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (!file) {
    return { isValid: false, error: 'File is required' }
  }

  // Check file size
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: 'Image size must be less than 10MB'
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Image must be JPEG, PNG, or WebP format'
    }
  }

  return { isValid: true }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const files = formData.getAll('images') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    // Validate maximum number of images (5)
    if (files.length > 5) {
      return NextResponse.json({ error: 'Maximum 5 images allowed per product' }, { status: 400 })
    }

    // Validate each file
    for (const file of files) {
      const validation = validateProductImage(file)
      if (!validation.isValid) {
        return NextResponse.json({ error: validation.error }, { status: 400 })
      }
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products', user.userId)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const uploadedImages: Array<{
      filename: string
      url: string
      size: number
      type: string
    }> = []

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Generate unique filename
      const timestamp = Date.now()
      const randomSuffix = Math.random().toString(36).substring(2, 8)
      const fileExtension = file.name.split('.').pop()
      const filename = `product_${timestamp}_${i}_${randomSuffix}.${fileExtension}`
      const filepath = join(uploadDir, filename)
      const publicPath = `/uploads/products/${user.userId}/${filename}`

      // Save file to disk
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)

      uploadedImages.push({
        filename,
        url: publicPath,
        size: file.size,
        type: file.type
      })
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages,
      count: uploadedImages.length
    })

  } catch (error) {
    console.error('Product image upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete product images
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
    }

    // Construct file path
    const filepath = join(process.cwd(), 'public', 'uploads', 'products', user.userId, filename)

    // Check if file exists and delete it
    if (existsSync(filepath)) {
      const fs = require('fs').promises
      await fs.unlink(filepath)
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    })

  } catch (error) {
    console.error('Product image deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}