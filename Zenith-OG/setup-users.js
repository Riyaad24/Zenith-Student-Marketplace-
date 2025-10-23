const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function setupUsersWithAuth() {
  console.log('🔧 Setting up user authentication...')

  try {
    // Create Student role if it doesn't exist
    console.log('📝 Creating user roles...')
    let studentRole = await prisma.userRole.findUnique({
      where: { name: 'Student' }
    })

    if (!studentRole) {
      studentRole = await prisma.userRole.create({
        data: {
          name: 'Student',
          description: 'Standard student user with basic marketplace access',
          permissions: {
            can_buy: true,
            can_sell: true,
            can_message: true,
            can_review: true,
            can_view_products: true
          }
        }
      })
    }

    // Set up passwords for existing users
    console.log('🔑 Setting up user passwords...')
    const users = await prisma.user.findMany()
    
    for (const user of users) {
      // Check if user already has security setup
      const existingSecurity = await prisma.accountSecurity.findUnique({
        where: { userId: user.id }
      })

      if (!existingSecurity) {
        // Create default password: "password123"
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash('password123', salt)

        await prisma.accountSecurity.create({
          data: {
            userId: user.id,
            passwordHash,
            salt,
            emailVerified: true,
            emailVerifiedAt: new Date()
          }
        })

        // Assign student role
        const existingAssignment = await prisma.userRoleAssignment.findUnique({
          where: {
            unique_user_role: {
              userId: user.id,
              roleId: studentRole.id
            }
          }
        })

        if (!existingAssignment) {
          await prisma.userRoleAssignment.create({
            data: {
              userId: user.id,
              roleId: studentRole.id
            }
          })
        }

        console.log(`✅ Set up authentication for ${user.email} with password: password123`)
      } else {
        console.log(`⚠️  User ${user.email} already has authentication setup`)
      }
    }

    console.log('🎉 User authentication setup completed!')
    console.log('\nSample users you can log in with:')
    console.log('Email: 402302567@my.richfield.ac.za | Password: password123')
    console.log('Email: 402304891@my.richfield.ac.za | Password: password123') 
    console.log('Email: 402306123@my.richfield.ac.za | Password: password123')

  } catch (error) {
    console.error('❌ Error setting up user authentication:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupUsersWithAuth()