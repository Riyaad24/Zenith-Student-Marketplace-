// Grant full admin permissions to existing admin users
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function grantAdminPermissions() {
  try {
    const email = '402306532ads@my.richfield.ac.za'
    const studentNumber = '402306532'
    
    console.log(`Granting full admin permissions to: ${email}`)
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('User not found! Please register the user first.')
      return
    }
    
    console.log(`Found user: ${user.firstName} ${user.lastName} (${user.email})`)
    
    // Check if admin record exists
    let admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { userId: user.id },
          { studentNumber: studentNumber }
        ]
      }
    })
    
    if (admin) {
      console.log('Admin record found, updating permissions...')
      
      // Update existing admin with full permissions
      admin = await prisma.admin.update({
        where: { id: admin.id },
        data: {
          permissions: ['*'], // Full permissions (wildcard)
          isActive: true,
          userId: user.id,
          studentNumber: studentNumber
        }
      })
      
      console.log('✓ Admin permissions updated successfully!')
    } else {
      console.log('Admin record not found, creating new admin record...')
      
      // Create new admin record with full permissions
      admin = await prisma.admin.create({
        data: {
          userId: user.id,
          studentNumber: studentNumber,
          permissions: ['*'], // Full permissions (wildcard)
          isActive: true
        }
      })
      
      console.log('✓ Admin record created successfully!')
    }
    
    // Verify the admin permissions
    const verifyAdmin = await prisma.admin.findUnique({
      where: { id: admin.id },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })
    
    console.log('\n=== Admin Details ===')
    console.log(`ID: ${verifyAdmin.id}`)
    console.log(`User: ${verifyAdmin.user.firstName} ${verifyAdmin.user.lastName} (${verifyAdmin.user.email})`)
    console.log(`Student Number: ${verifyAdmin.studentNumber}`)
    console.log(`Permissions: ${JSON.stringify(verifyAdmin.permissions)}`)
    console.log(`Active: ${verifyAdmin.isActive}`)
    console.log(`Last Login: ${verifyAdmin.lastLoginAt || 'Never'}`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

grantAdminPermissions()
