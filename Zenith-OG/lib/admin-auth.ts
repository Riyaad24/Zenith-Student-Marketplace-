import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export interface AdminUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  adminId: string
  permissions: string[]
  isActive: boolean
}

// Check if email matches admin pattern (9 digits + ads@my.richfield.ac.za)
export function isAdminEmail(email: string): boolean {
  const adminEmailPattern = /^(\d{9})ads@my\.richfield\.ac\.za$/i
  return adminEmailPattern.test(email)
}

// Extract student number from admin email
export function extractStudentNumber(email: string): string | null {
  const adminEmailPattern = /^(\d{9})ads@my\.richfield\.ac\.za$/i
  const match = email.match(adminEmailPattern)
  return match ? match[1] : null
}

// Check admin quota
export async function checkAdminQuota(): Promise<{ canCreate: boolean; currentCount: number; maxCount: number }> {
  const maxAdmins = parseInt(process.env.ADMIN_MAX_ADMINS || '14', 10)
  const currentCount = await prisma.admin.count({
    where: { 
      isActive: true 
    }
  })
  
  return {
    canCreate: currentCount < maxAdmins,
    currentCount,
    maxCount: maxAdmins
  }
}

// Check if user is in allowlists
export function isInAllowlist(email: string, studentNumber?: string): boolean {
  const emailAllowlist = process.env.ADMIN_EMAIL_ALLOWLIST?.split(',').map(e => e.trim().toLowerCase()) || []
  const studentAllowlist = process.env.ADMIN_STUDENT_ALLOWLIST?.split(',').map(s => s.trim()) || []
  
  const emailLower = email.toLowerCase()
  
  return emailAllowlist.includes(emailLower) || 
         (studentNumber ? studentAllowlist.includes(studentNumber) : false)
}

// Get admin user from request token
export async function getAdminFromRequest(request: NextRequest): Promise<AdminUser | null> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                 request.cookies.get('auth-token')?.value

    if (!token) return null

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
    
    if (!decoded.userId) return null

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        admin: true
      }
    })

    if (!user || !user.admin || !user.admin.isActive) return null

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      adminId: user.admin.id,
      permissions: user.admin.permissions as string[],
      isActive: user.admin.isActive
    }
  } catch (error) {
    console.error('Admin auth error:', error)
    return null
  }
}

// Check if admin has specific permission
export function hasPermission(admin: AdminUser, permission: string): boolean {
  return admin.permissions.includes(permission) || admin.permissions.includes('*')
}

// Default admin permissions
export const ADMIN_PERMISSIONS = {
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  PRODUCTS_READ: 'products:read',
  PRODUCTS_UPDATE: 'products:update',
  PRODUCTS_DELETE: 'products:delete',
  ORDERS_READ: 'orders:read',
  ORDERS_UPDATE: 'orders:update',
  LOGS_READ: 'logs:read',
  ADMIN_ALL: '*'
} as const

// Log admin sign-in
export async function logAdminSignIn(
  adminId: string,
  ipAddress: string,
  userAgent?: string,
  location?: string,
  deviceInfo?: any
) {
  try {
    await prisma.adminSignInLog.create({
      data: {
        adminId,
        ipAddress,
        userAgent,
        location,
        deviceInfo: deviceInfo ? JSON.stringify(deviceInfo) : undefined
      }
    })

    // Update admin's last login
    await prisma.admin.update({
      where: { id: adminId },
      data: { lastLoginAt: new Date() }
    })
  } catch (error) {
    console.error('Failed to log admin sign-in:', error)
  }
}

// Log admin action for audit trail
export async function logAdminAction(
  adminId: string,
  action: string,
  targetType: string,
  targetId?: string,
  oldValues?: any,
  newValues?: any,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        adminId,
        action,
        targetType,
        targetId,
        oldValues: oldValues ? JSON.stringify(oldValues) : undefined,
        newValues: newValues ? JSON.stringify(newValues) : undefined,
        ipAddress,
        userAgent
      }
    })
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}

// Get client IP address from request
export function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] ||
         request.headers.get('x-real-ip') ||
         'unknown'
}

// Parse user agent for device info
export function parseUserAgent(userAgent: string) {
  // Simple user agent parsing - in production, use a library like ua-parser-js
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent)
  const browser = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/[\d.]+/)?.[0] || 'Unknown'
  const os = userAgent.match(/(Windows|Mac|Linux|Android|iOS)/)?.[0] || 'Unknown'
  
  return {
    isMobile,
    browser,
    os,
    raw: userAgent
  }
}