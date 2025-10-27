const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createInitialAdmin() {
  try {
    // Admin email pattern: 9 digits + ads@my.richfield.ac.za
    const adminEmail = '123456789ads@my.richfield.ac.za'
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      console.log('Admin user already exists:', adminEmail)
      return
    }

    // Hash password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash('admin123', salt)

    const adminUser = await prisma.$transaction(async (tx) => {
      // Create user profile
      const user = await tx.user.create({
        data: {
          email: adminEmail,
          firstName: 'System',
          lastName: 'Administrator',
          university: 'Richfield Graduate Institute',
          verified: true,
        },
      })

      // Create security record
      await tx.accountSecurity.create({
        data: {
          userId: user.id,
          passwordHash,
          salt,
          emailVerified: true,
        },
      })

      // Create admin record
      await tx.admin.create({
        data: {
          userId: user.id,
          permissions: [
            'users:read',
            'users:create', 
            'users:update',
            'users:delete',
            'products:read',
            'products:update',
            'products:delete',
            'orders:read',
            'orders:update',
            'logs:read'
          ],
          isActive: true
        }
      })

      // Find or create admin role
      let adminRole = await tx.userRole.findUnique({
        where: { name: 'admin' }
      })

      if (!adminRole) {
        adminRole = await tx.userRole.create({
          data: {
            name: 'admin',
            description: 'Administrator role with full access',
            permissions: JSON.stringify(['admin', 'read', 'create', 'update', 'delete'])
          }
        })
      }

      // Assign admin role
      await tx.userRoleAssignment.create({
        data: {
          userId: user.id,
          roleId: adminRole.id,
        },
      })

      return user
    })

    console.log('✅ Initial admin user created successfully!')
    console.log('Email:', adminEmail)
    console.log('Password: admin123')
    console.log('Please change this password after first login!')

  } catch (error) {
    console.error('❌ Error creating initial admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createInitialAdmin()