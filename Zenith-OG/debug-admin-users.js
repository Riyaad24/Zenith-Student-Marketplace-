// Debug script to check admin users in database
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAdminUsers() {
  try {
    console.log('=== Checking Users with Admin Pattern ===')
    
    const adminPatternUsers = await prisma.user.findMany({
      where: {
        email: {
          contains: 'ads@my.richfield.ac.za'
        }
      },
      include: {
        security: true,
        admin: true
      }
    })
    
    console.log(`Found ${adminPatternUsers.length} users with admin email pattern:`)
    adminPatternUsers.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Has Security: ${!!user.security}, Has Admin Record: ${!!user.admin}`)
    })
    
    console.log('\n=== Checking Admin Table ===')
    const admins = await prisma.admin.findMany({
      include: {
        user: true
      }
    })
    
    console.log(`Found ${admins.length} admin records:`)
    admins.forEach(admin => {
      console.log(`- ID: ${admin.id}, Student Number: ${admin.studentNumber}, Email: ${admin.email}, User ID: ${admin.userId}, User Email: ${admin.user?.email || 'N/A'}`)
    })
    
    console.log('\n=== Testing Specific Email ===')
    const testEmail = '402306532ads@my.richfield.ac.za'
    const userByEmail = await prisma.user.findUnique({
      where: { email: testEmail },
      include: {
        security: true,
        admin: true
      }
    })
    
    if (userByEmail) {
      console.log(`User found for ${testEmail}:`)
      console.log(`- ID: ${userByEmail.id}`)
      console.log(`- Name: ${userByEmail.firstName} ${userByEmail.lastName}`)
      console.log(`- Has Security: ${!!userByEmail.security}`)
      console.log(`- Has Admin Record: ${!!userByEmail.admin}`)
      
      if (userByEmail.security) {
        console.log(`- Password Hash exists: ${!!userByEmail.security.passwordHash}`)
      }
    } else {
      console.log(`No user found for email: ${testEmail}`)
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdminUsers()