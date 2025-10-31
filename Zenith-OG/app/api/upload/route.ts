import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '@/lib/config'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { prisma } from '@/lib/prisma'
import { validateVerificationFile } from '@/lib/validation'

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

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
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
    const file = formData.get('file') as File
    const uploadType = formData.get('type') as 'profile' | 'studentCard' | 'idDocument'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!uploadType || !['profile', 'studentCard', 'idDocument'].includes(uploadType)) {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 })
    }

    // Validate file
    const validation = validateVerificationFile(file, uploadType)
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', user.userId)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const filename = `${uploadType}_${timestamp}.${fileExtension}`
    const filepath = join(uploadDir, filename)
    const publicPath = `/uploads/${user.userId}/${filename}`

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Update user profile in database
    const updateData: any = {}
    const documentsUploadedCheck: any = {}

    switch (uploadType) {
      case 'profile':
        updateData.profilePicture = publicPath
        updateData.avatar = publicPath // Also update the main avatar field
        break
      case 'studentCard':
        updateData.studentCardImage = publicPath
        break
      case 'idDocument':
        updateData.idDocumentImage = publicPath
        break
    }

    // Check if all documents are uploaded to update documentsUploaded status
    const currentUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        profilePicture: true,
        studentCardImage: true,
        idDocumentImage: true
      }
    })

    if (currentUser) {
      const willHaveAllDocs = {
        profilePicture: updateData.profilePicture || currentUser.profilePicture,
        studentCardImage: updateData.studentCardImage || currentUser.studentCardImage,
        idDocumentImage: updateData.idDocumentImage || currentUser.idDocumentImage
      }

      if (willHaveAllDocs.profilePicture && willHaveAllDocs.studentCardImage && willHaveAllDocs.idDocumentImage) {
        updateData.documentsUploaded = true
      }
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: updateData,
      select: {
        id: true,
        profilePicture: true,
        studentCardImage: true,
        idDocumentImage: true,
        documentsUploaded: true,
        adminVerified: true
      }
    })

    return NextResponse.json({
      success: true,
      filename,
      url: publicPath,
      user: updatedUser
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get uploaded files for current user
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's uploaded files from database
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        profilePicture: true,
        studentCardImage: true,
        idDocumentImage: true,
        documentsUploaded: true,
        adminVerified: true,
        verifiedAt: true,
        verificationNotes: true
      }
    })

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      uploads: {
        profilePicture: userData.profilePicture,
        studentCardImage: userData.studentCardImage,
        idDocumentImage: userData.idDocumentImage
      },
      verification: {
        documentsUploaded: userData.documentsUploaded,
        adminVerified: userData.adminVerified,
        verifiedAt: userData.verifiedAt,
        notes: userData.verificationNotes
      }
    })

  } catch (error) {
    console.error('Get uploads error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
