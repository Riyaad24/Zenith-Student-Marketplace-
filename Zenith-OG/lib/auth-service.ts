import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  university?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  permissions: string[];
}

class AuthService {
  private static readonly SALT_ROUNDS = 12;
  private static readonly JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';
  private static readonly JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

  // Register new user
  static async register(data: RegisterData): Promise<{ user: AuthUser; token: string }> {
    const { email, password, firstName, lastName, university, phone } = data;

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create user transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create user profile
        const user = await tx.user.create({
          data: {
            email,
            firstName,
            lastName,
            university,
            phone,
            verified: false,
          },
        });

        // Create security record
        await tx.accountSecurity.create({
          data: {
            userId: user.id,
            passwordHash,
            salt,
            emailVerificationToken: randomBytes(32).toString('hex'),
          },
        });

        // Assign default student role
        let studentRole = await tx.userRole.findUnique({
          where: { name: 'student' }, // Use lowercase to match API route
        });

        // Create role if it doesn't exist
        if (!studentRole) {
          studentRole = await tx.userRole.create({
            data: {
              name: 'student',
              description: 'Default student role',
              permissions: JSON.stringify(['read', 'create_listing', 'purchase', 'message'])
            }
          });
        }

        // Assign role to user
        await tx.userRoleAssignment.create({
          data: {
            userId: user.id,
            roleId: studentRole.id,
          },
        });

        // Log security event
        await this.logSecurityEvent(tx, user.id, 'USER_REGISTERED', 'users', user.id, 'LOW');

        return user;
      });

      // Generate JWT token
      const token = this.generateToken(result.id, email);

      // Get user with roles
      const userWithRoles = await this.getUserWithRoles(result.id);

      return { user: userWithRoles, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  static async login(data: LoginData, ipAddress?: string, userAgent?: string): Promise<{ user: AuthUser & { redirectTo?: string }; token: string }> {
    const { email, password } = data;

    try {
      // Log login attempt
      await this.logLoginAttempt(email, ipAddress || 'unknown', userAgent, false);

      // Find user with security data
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          security: true,
        },
      });

      if (!user || !user.security) {
        await this.logLoginAttempt(email, ipAddress || 'unknown', userAgent, false, 'User not found');
        throw new Error('Invalid credentials');
      }

      // Check if account is locked
      if (user.security.accountLocked && user.security.lockedUntil && user.security.lockedUntil > new Date()) {
        throw new Error('Account is temporarily locked. Please try again later.');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.security.passwordHash);

      if (!isValidPassword) {
        // Increment failed attempts
        await this.handleFailedLogin(user.id, email, ipAddress, userAgent);
        throw new Error('Invalid credentials');
      }

      // Reset failed attempts and update last login
      await prisma.$transaction(async (tx) => {
        await tx.accountSecurity.update({
          where: { userId: user.id },
          data: {
            failedLoginAttempts: 0,
            lastLogin: new Date(),
            accountLocked: false,
            lockedUntil: null,
          },
        });

        // Create user session
        await tx.userSession.create({
          data: {
            userId: user.id,
            sessionToken: randomBytes(32).toString('hex'),
            ipAddress: ipAddress || 'unknown',
            userAgent: userAgent || 'unknown',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          },
        });

        // Log successful login
        await this.logSecurityEvent(tx, user.id, 'USER_LOGIN', 'users', user.id, 'LOW', {
          ipAddress,
          userAgent,
        });
      });

      // Log successful login attempt
      await this.logLoginAttempt(email, ipAddress || 'unknown', userAgent, true);

      // Generate JWT token
      const token = this.generateToken(user.id, user.email);

      // Get user with roles
      const userWithRoles = await this.getUserWithRoles(user.id);

      // Check if user is admin by role OR by email pattern (admin logic from API route)
      let isAdmin = userWithRoles.roles.includes('admin');
      
      // Also check admin email pattern
      if (!isAdmin) {
        const ADMIN_EMAIL_REGEX = /^(\d{9})ads@my\.richfield\.ac\.za$/i;
        const userEmail = (user.email || '').toLowerCase();
        const adminMatch = userEmail.match(ADMIN_EMAIL_REGEX);
        
        if (adminMatch) {
          const studentDigits = adminMatch[1];
          
          // Check if there's an admin record for this user
          const adminRecord = await prisma.admin.findFirst({
            where: {
              OR: [
                { studentNumber: studentDigits },
                { userId: user.id }
              ]
            }
          });
          
          isAdmin = !!adminRecord;
        }
      }
      
      const userWithRedirect = {
        ...userWithRoles,
        redirectTo: isAdmin ? '/admin/dashboard' : undefined
      };

      return { user: userWithRedirect, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Get user with roles and permissions
  static async getUserWithRoles(userId: string): Promise<AuthUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roleAssignments: {
          include: {
            role: true,
          },
          where: {
            isActive: true,
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } },
            ],
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const roles = user.roleAssignments.map(assignment => assignment.role.name);
    const permissions = user.roleAssignments.reduce((acc, assignment) => {
      const rolePermissions = assignment.role.permissions as any;
      
      // Check if rolePermissions exists and is an object
      if (rolePermissions && typeof rolePermissions === 'object') {
        Object.keys(rolePermissions).forEach(permission => {
          // For boolean permissions (like can_buy: true), add the permission name if it's true
          if (rolePermissions[permission] === true) {
            acc.push(permission);
          }
        });
      }
      return acc;
    }, [] as string[]);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      roles,
      permissions: [...new Set(permissions)], // Remove duplicates
    };
  }

  // Generate JWT token
  private static generateToken(userId: string, email?: string): string {
    const payload: any = { userId }
    if (email) {
      payload.email = email
    }
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRY } as jwt.SignOptions);
  }

  // Verify JWT token
  static async verifyToken(token: string): Promise<AuthUser> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string };
      return await this.getUserWithRoles(decoded.userId);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Handle failed login attempts
  private static async handleFailedLogin(userId: string, email: string, ipAddress?: string, userAgent?: string) {
    const MAX_ATTEMPTS = 5;
    const LOCK_DURATION = 30 * 60 * 1000; // 30 minutes

    await prisma.$transaction(async (tx) => {
      const security = await tx.accountSecurity.findUnique({
        where: { userId },
      });

      if (!security) return;

      const newFailedAttempts = security.failedLoginAttempts + 1;

      // Lock account if max attempts reached
      const shouldLock = newFailedAttempts >= MAX_ATTEMPTS;

      await tx.accountSecurity.update({
        where: { userId },
        data: {
          failedLoginAttempts: newFailedAttempts,
          accountLocked: shouldLock,
          lockedUntil: shouldLock ? new Date(Date.now() + LOCK_DURATION) : null,
        },
      });

      // Log security event
      await this.logSecurityEvent(
        tx,
        userId,
        shouldLock ? 'ACCOUNT_LOCKED' : 'FAILED_LOGIN',
        'users',
        userId,
        shouldLock ? 'HIGH' : 'MEDIUM',
        { attempts: newFailedAttempts, ipAddress, userAgent }
      );
    });

    // Log failed login attempt
    await this.logLoginAttempt(email, ipAddress || 'unknown', userAgent, false, 'Invalid password');
  }

  // Log security events
  private static async logSecurityEvent(
    tx: any,
    userId: string | null,
    action: string,
    resourceType: string | null,
    resourceId: string | null,
    riskLevel: string,
    details?: any
  ) {
    await tx.securityAuditLog.create({
      data: {
        userId,
        action,
        resourceType,
        resourceId,
        riskLevel,
        details: details ? JSON.stringify(details) : null,
      },
    });
  }

  // Log login attempts
  private static async logLoginAttempt(
    email: string,
    ipAddress: string,
    userAgent?: string,
    success: boolean = false,
    failureReason?: string
  ) {
    await prisma.loginAttempt.create({
      data: {
        email,
        ipAddress,
        userAgent,
        success,
        failureReason,
      },
    });
  }

  // Logout user (invalidate session)
  static async logout(token: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string };
      
      await prisma.$transaction(async (tx) => {
        // Deactivate user sessions
        await tx.userSession.updateMany({
          where: { userId: decoded.userId, isActive: true },
          data: { isActive: false },
        });

        // Log logout event
        await this.logSecurityEvent(tx, decoded.userId, 'USER_LOGOUT', 'users', decoded.userId, 'LOW');
      });
    } catch (error) {
      // Token might be invalid, but we don't throw error for logout
      console.error('Logout error:', error);
    }
  }

  // Check user permissions
  static async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const user = await this.getUserWithRoles(userId);
    
    // Check if user has the specific permission
    return user.permissions.some(permission => {
      const [permResource, permAction] = permission.split(':');
      return permResource === resource && permAction === action;
    });
  }
}

export default AuthService;