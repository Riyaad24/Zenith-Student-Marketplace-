import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { isAdminEmail, extractStudentNumber, isInAllowlist } from '@/lib/admin-auth'

export interface AdminAuthResult {
  isAuthorized: boolean
  adminId?: string
  userId?: string
  email?: string
  error?: string
}

/**
 * Admin authentication middleware
 * Requires email to match /^(\d{9})ads@my.richfield.ac.za$/ pattern
 * AND checks admins table for matching student_number or user_id
 * OR allows if email/student is in ADMIN_EMAIL_ALLOWLIST/ADMIN_STUDENT_ALLOWLIST env vars
 */
export async function adminAuth(request: NextRequest): Promise<AdminAuthResult> {
  try {
    // Get token from Authorization header or cookies
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                 request.cookies.get('auth-token')?.value

    if (!token) {
      return { isAuthorized: false, error: 'No authentication token provided' }
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
    
    if (!decoded.userId || !decoded.email) {
      return { isAuthorized: false, error: 'Invalid token payload' }
    }

    const email = decoded.email.toLowerCase()
    
    // Check if email matches admin pattern
    if (!isAdminEmail(email)) {
      return { isAuthorized: false, error: 'Email does not match admin pattern' }
    }

    // Extract student number from email
    const studentNumber = extractStudentNumber(email)
    
    // Check allowlists first (ENV vars)
    if (isInAllowlist(email, studentNumber || undefined)) {
      return { 
        isAuthorized: true, 
        userId: decoded.userId, 
        email,
        adminId: 'allowlist' // Special marker for allowlist users
      }
    }

    // Check admins table for matching student_number OR user_id
    const admin = await prisma.admin.findFirst({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { studentNumber: studentNumber },
              { userId: decoded.userId }
            ]
          }
        ]
      }
    })

    if (!admin) {
      return { isAuthorized: false, error: 'User is not registered as admin' }
    }

    return { 
      isAuthorized: true, 
      adminId: admin.id,
      userId: decoded.userId, 
      email
    }
    
  } catch (error) {
    console.error('Admin auth middleware error:', error)
    return { isAuthorized: false, error: 'Authentication failed' }
  }
}

/**
 * Helper function to create unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    { error: message }, 
    { status: 403 }
  )
}

/**
 * Wrapper function for API route handlers that require admin auth
 */
export function withAdminAuth(
  handler: (request: NextRequest, authResult: AdminAuthResult, ...args: any[]) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const authResult = await adminAuth(request)
    
    if (!authResult.isAuthorized) {
      return unauthorizedResponse(authResult.error)
    }
    
    return handler(request, authResult, ...args)
  }
}