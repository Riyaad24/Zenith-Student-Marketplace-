import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { isAdminEmail, extractStudentNumber, isInAllowlist, getAdminFromRequest, AdminUser } from '@/lib/admin-auth'

export interface AdminAuthResult {
  isAuthorized: boolean
  adminId?: string
  userId?: string
  email?: string
  admin?: AdminUser | null
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
    
    // Extract student number from email if it matches the admin email pattern.
    // Note: we do NOT require the admin email to match a specific pattern here —
    // admins can be linked in the `admins` table by userId, or allowed via allowlists.
    const studentNumber = isAdminEmail(email) ? extractStudentNumber(email) : null
    
    // Check allowlists first (ENV vars)
    if (isInAllowlist(email, studentNumber || undefined)) {
      // Create a synthetic admin object granting full permissions for allowlisted users
      const allowlistAdmin: AdminUser = {
        id: decoded.userId,
        email,
        firstName: null,
        lastName: null,
        adminId: 'allowlist',
        permissions: ['*'],
        isActive: true
      }

      return { 
        isAuthorized: true, 
        userId: decoded.userId, 
        email,
        adminId: 'allowlist', // Special marker for allowlist users
        admin: allowlistAdmin
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

    // Also fetch the richer admin user object (includes permissions) to pass to handlers
    let adminUser = await getAdminFromRequest(request)

    // If getAdminFromRequest didn't return an AdminUser (e.g., admin record isn't linked to the user record),
    // construct a minimal AdminUser from the admins table record we fetched above so route handlers
    // that call hasPermission(...) still receive the expected shape.
    if (!adminUser) {
      let permissions: string[] = []
      try {
        permissions = Array.isArray(admin.permissions) ? admin.permissions : JSON.parse(String(admin.permissions || '[]'))
      } catch (e) {
        permissions = []
      }

      adminUser = {
        id: decoded.userId,
        email,
        firstName: null,
        lastName: null,
        adminId: admin.id,
        permissions,
        isActive: !!admin.isActive
      }
    }

    return { 
      isAuthorized: true, 
      adminId: admin.id,
      userId: decoded.userId, 
      email,
      admin: adminUser
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