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
 * Validates PDF file
 */
function validatePDFFile(file: File): {
  isValid: boolean
  error?: string
} {
  // Maximum file size: 50MB for PDFs
  const maxSizeBytes = 50 * 1024 * 1024
  
  // Allowed file type
  const allowedTypes = ['application/pdf']

  if (!file) {
    return { isValid: false, error: 'File is required' }
  }

  // Check file size
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: 'PDF size must be less than 50MB'
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'File must be in PDF format'
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
    const file = formData.get('pdf') as File

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 })
    }

    // Validate the file
    const validation = validatePDFFile(file)
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'pdfs', user.userId)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}_${randomSuffix}_${originalName}`
    const filepath = join(uploadDir, filename)
    const publicPath = `/uploads/pdfs/${user.userId}/${filename}`

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    return NextResponse.json({
      success: true,
      pdf: {
        filename,
        url: publicPath,
        size: file.size,
        type: file.type,
        originalName: file.name
      }
    })

  } catch (error) {
    console.error('PDF upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete PDF file
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
    const filepath = join(process.cwd(), 'public', 'uploads', 'pdfs', user.userId, filename)

    // Check if file exists and delete it
    if (existsSync(filepath)) {
      const fs = require('fs').promises
      await fs.unlink(filepath)
    }

    return NextResponse.json({
      success: true,
      message: 'PDF deleted successfully'
    })

  } catch (error) {
    console.error('PDF deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
