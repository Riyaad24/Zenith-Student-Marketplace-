const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    const email = '402306532ads@my.richfield.ac.za'
    const password = 'password123' // You can change this
    const studentNumber = '402306532'
    
    console.log(`Creating admin user: ${email}`)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      console.log('User already exists!')
      return
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)
    
    // Create user with security and admin records
    const user = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: email,
        phone: '+27123456789',
        university: 'Richfield Graduate Institute of Technology',
        verified: true,
        security: {
          create: {
            passwordHash,
            salt: 'default-salt',
            lastLogin: new Date(),
            emailVerified: true
          }
        },
        admin: {
          create: {
            studentNumber,
            email,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      },
      include: {
        security: true,
        admin: true
      }
    })
    
    console.log('Admin user created successfully!')
    console.log(`- ID: ${user.id}`)
    console.log(`- Email: ${user.email}`)
    console.log(`- Password: ${password}`)
    console.log(`- Student Number: ${studentNumber}`)
    
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()