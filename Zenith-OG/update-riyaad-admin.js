const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function updateRiyaadAdmin() {
  try {
    const email = '402306532ads@my.richfield.ac.za'
    const password = 'Riyaad24*'
    const firstName = 'Riyaad'
    const lastName = 'Lassissi'
    const studentNumber = '402306532'
    
    console.log('🔍 Updating admin account...')
    console.log('Email:', email)
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        security: true,
        admin: true
      }
    })

    if (!user) {
      console.log('❌ User not found. Creating new account...')
      
      // Create new user
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)

      await prisma.$transaction(async (tx) => {
        // Create user
        user = await tx.user.create({
          data: {
            email,
            firstName,
            lastName,
            university: 'Richfield Graduate Institute',
            verified: true,
            adminVerified: true,
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
            studentNumber: studentNumber,
            permissions: ['*'],
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
      })

      console.log('✅ New admin account created!')
    } else {
      console.log('✅ User found. Updating details...')
      
      // Update user details
      await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName,
          lastName,
          verified: true,
          adminVerified: true
        }
      })
      console.log('✅ User profile updated')
      
      // Update password
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)
      
      await prisma.accountSecurity.update({
        where: { userId: user.id },
        data: {
          passwordHash,
          salt,
          emailVerified: true,
        }
      })
      console.log('✅ Password updated')
      
      // Update/create admin record
      if (user.admin) {
        await prisma.admin.update({
          where: { id: user.admin.id },
          data: {
            studentNumber: studentNumber,
            permissions: ['*'],
            isActive: true
          }
        })
        console.log('✅ Admin record updated')
      } else {
        await prisma.admin.create({
          data: {
            userId: user.id,
            studentNumber: studentNumber,
            permissions: ['*'],
            isActive: true
          }
        })
        console.log('✅ Admin record created')
      }
      
      // Ensure admin role is assigned
      const roleAssignment = await prisma.userRoleAssignment.findFirst({
        where: {
          userId: user.id,
          role: { name: 'admin' }
        }
      })
      
      if (!roleAssignment) {
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
        }

        await prisma.userRoleAssignment.create({
          data: {
            userId: user.id,
            roleId: adminRole.id,
          }
        })
        console.log('✅ Admin role assigned')
      } else {
        console.log('✅ Admin role already assigned')
      }
    }

    console.log('\n╔════════════════════════════════════════════════════╗')
    console.log('║          Admin Account Updated!                    ║')
    console.log('╚════════════════════════════════════════════════════╝')
    console.log('Name:', firstName, lastName)
    console.log('Email:', email)
    console.log('Password: Riyaad24*')
    console.log('Student Number:', studentNumber)
    console.log('Permissions: Full Access (*)')
    console.log('\n✅ Login at: http://localhost:3000/login\n')

  } catch (error) {
    console.error('❌ Error updating admin:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

updateRiyaadAdmin()
