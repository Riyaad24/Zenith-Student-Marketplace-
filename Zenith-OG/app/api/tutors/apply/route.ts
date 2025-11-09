import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface JWTPayload {
  userId: string
  email: string
}

export async function POST(request: NextRequest) {
  try {
    // Get the token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      console.error('No auth token found in cookies')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify the token
    let userId: string
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
      userId = decoded.userId
      console.log('User authenticated:', decoded.email)
    } catch (error) {
      console.error('Token verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get the application data from the request body
    const data = await request.json()

    const {
      fullName,
      institution,
      modules,
      qualification,
      hourlyRate,
      bio,
      profilePicture,
      proofOfRegistration,
      transcript,
    } = data

    // Validate required fields
    if (!fullName || !institution || !modules || modules.length === 0 || !qualification || !hourlyRate || !bio) {
      console.error('Validation failed:', { 
        fullName: !!fullName, 
        institution: !!institution, 
        modules: modules, 
        modulesLength: modules?.length,
        qualification: !!qualification, 
        hourlyRate: !!hourlyRate, 
        bio: !!bio 
      })
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    console.log('Creating tutor application:', {
      userId,
      fullName,
      institution,
      modulesCount: modules.length,
      qualification,
      hourlyRate,
      bioLength: bio?.length,
      hasProfilePicture: !!profilePicture,
      hasProofOfRegistration: !!proofOfRegistration,
      hasTranscript: !!transcript,
    })

    // Create the tutor application
    let application
    try {
      application = await prisma.tutorApplication.create({
        data: {
          userId,
          fullName,
          institution,
          modules: modules, // Stored as JSON
          qualification,
          hourlyRate: parseFloat(hourlyRate),
          bio,
          profilePicture: profilePicture || null,
          proofOfRegistration: proofOfRegistration || null,
          transcript: transcript || null,
          status: 'pending',
        },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      })
      console.log('Tutor application created successfully:', application.id)
    } catch (dbError) {
      console.error('Database error creating tutor application:', dbError)
      if (dbError instanceof Error) {
        console.error('DB Error message:', dbError.message)
        console.error('DB Error stack:', dbError.stack)
      }
      throw dbError
    }

    // Create a notification for the user
    try {
      await prisma.notification.create({
        data: {
          userId,
          title: 'Tutor Application Submitted',
          message: 'Your tutor application has been submitted and is pending review by our admin team.',
          type: 'info',
          read: false,
        },
      })
      console.log('Notification created successfully')
    } catch (notifError) {
      console.error('Error creating notification (non-critical):', notifError)
      // Don't fail the whole request if notification fails
    }

    return NextResponse.json({
      success: true,
      message: 'Tutor application submitted successfully',
      application: {
        id: application.id,
        status: application.status,
        submittedAt: application.submittedAt,
      },
    })
  } catch (error) {
    console.error('Error creating tutor application:', error)
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to submit tutor application',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
