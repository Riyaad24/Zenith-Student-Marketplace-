import { prisma } from '@/lib/prisma'

/**
 * Log admin actions for audit trail
 * @param adminId - Admin user ID performing the action
 * @param targetUserId - Target user ID being acted upon (optional)
 * @param action - Action being performed (e.g., 'CREATE_USER', 'DELETE_USER')
 * @param searchQuery - Search query used if applicable (optional)
 * @param ip - IP address of the admin (optional)
 */
export async function auditLog(
  adminId: string | null,
  targetUserId: string | null,
  action: string,
  searchQuery: string | null = null,
  ip: string | null = null
): Promise<void> {
  try {
    // Skip if no valid adminId (e.g., allowlist users or null)
    if (!adminId || adminId === 'allowlist') {
      return
    }

    await prisma.adminAuditLog.create({
      data: {
        adminId,
        action,
        targetType: 'USER',
        targetId: targetUserId,
        oldValues: undefined,
        newValues: searchQuery ? JSON.stringify({ searchQuery }) : undefined,
        ipAddress: ip,
        userAgent: null
      }
    })
  } catch (error) {
    // Swallow but log errors - do not crash request
    console.error('Failed to log admin audit action:', error)
  }
}

/**
 * Log admin sign-in events
 * @param adminId - Admin user ID (can be null if user not found)
 * @param adminEmail - Admin email address
 * @param ip - IP address of the sign-in
 * @param userAgent - User agent string from browser
 */
export async function logAdminSignin(
  adminId: string | null,
  adminEmail: string,
  ip: string,
  userAgent: string | null
): Promise<void> {
  try {
    // Find admin record by email or student number
    let admin = null
    
    if (adminId) {
      admin = await prisma.admin.findFirst({
        where: {
          userId: adminId
        }
      })
    }
    
    if (!admin && adminEmail) {
      // Extract student number from email if it matches pattern
      const emailLower = adminEmail.toLowerCase()
      const match = emailLower.match(/^(\d{9})ads@my\.richfield\.ac\.za$/)
      
      if (match) {
        const studentDigits = match[1]
        admin = await prisma.admin.findFirst({
          where: {
            OR: [
              { studentNumber: studentDigits },
              { email: emailLower }
            ]
          }
        })
      }
    }

    if (admin) {
      await prisma.adminSignInLog.create({
        data: {
          adminId: admin.id,
          ipAddress: ip,
          userAgent,
          location: null, // Could be enhanced with geo-IP
          deviceInfo: userAgent ? JSON.stringify({ userAgent }) : undefined
        }
      })

      // Update admin's last login
      await prisma.admin.update({
        where: { id: admin.id },
        data: { lastLoginAt: new Date() }
      })
    }
  } catch (error) {
    // Swallow but log errors - do not crash request
    console.error('Failed to log admin sign-in:', error)
  }
}

/**
 * Enhanced audit log with old/new values for detailed tracking
 */
export async function auditLogDetailed(
  adminId: string,
  action: string,
  targetType: string,
  targetId?: string,
  oldValues?: any,
  newValues?: any,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
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
    console.error('Failed to log detailed admin action:', error)
  }
}