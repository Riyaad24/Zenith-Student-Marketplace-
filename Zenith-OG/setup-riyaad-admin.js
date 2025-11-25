const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function addRiyaadAdmin() {
  try {
    console.log('🔐 Setting up Riyaad as admin...')
    
    // Find Riyaad's user account
    const riyaad = await prisma.user.findUnique({
      where: { email: '402306532ads@my.richfield.ac.za' },
      include: {
        admin: true,
        security: true,
        roleAssignments: {
          include: {
            role: true
          }
        }
      }
    })

    if (!riyaad) {
      console.log('❌ Riyaad user not found')
      return
    }

    console.log('✅ User found')

    // Update password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash('Riyaad24**', salt)
    
    await prisma.accountSecurity.update({
      where: { userId: riyaad.id },
      data: {
        passwordHash,
        salt,
        emailVerified: true
      }
    })
    console.log('✅ Password updated to: Riyaad24**')

    // Check if admin record exists
    if (!riyaad.admin) {
      await prisma.admin.create({
        data: {
          userId: riyaad.id,
          studentNumber: '402306532',
          permissions: ['*'],
          isActive: true
        }
      })
      console.log('✅ Admin record created with full permissions')
    } else {
      await prisma.admin.update({
        where: { id: riyaad.admin.id },
        data: {
          permissions: ['*'],
          isActive: true
        }
      })
      console.log('✅ Admin permissions updated to full access')
    }

    // Check if admin role exists
    let adminRole = await prisma.userRole.findUnique({
      where: { name: 'admin' }
    })

    if (!adminRole) {
      adminRole = await prisma.userRole.create({
        data: {
          name: 'admin',
          description: 'Administrator role with full access',
          permissions: JSON.stringify(['admin', 'read', 'create', 'update', 'delete'])
        }
      })
      console.log('✅ Admin role created')
    }

    // Check if admin role is assigned
    const hasAdminRole = riyaad.roleAssignments.some(
      ra => ra.role.name === 'admin'
    )

    if (!hasAdminRole) {
      await prisma.userRoleAssignment.create({
        data: {
          userId: riyaad.id,
          roleId: adminRole.id
        }
      })
      console.log('✅ Admin role assigned')
    } else {
      console.log('✅ Admin role already assigned')
    }

    // Verify user is verified and approved
    await prisma.user.update({
      where: { id: riyaad.id },
      data: {
        verified: true,
        adminVerified: true,
        documentsUploaded: true
      }
    })
    console.log('✅ User verified and approved')

    console.log('\n🎉 Setup complete!')
    console.log('📧 Email: 402306532ads@my.richfield.ac.za')
    console.log('🔑 Password: Riyaad24**')
    console.log('👨‍💼 Role: Admin with full access')
    console.log('🔓 Permissions: All (*)')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

addRiyaadAdmin()
