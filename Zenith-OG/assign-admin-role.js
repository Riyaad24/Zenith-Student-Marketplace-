// Assign admin role to the test user
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function assignAdminRole() {
  try {
    const email = '402306532ads@my.richfield.ac.za'
    
    console.log(`Assigning admin role to: ${email}`)
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('User not found!')
      return
    }
    
    // Find the admin role
    const adminRole = await prisma.userRole.findUnique({
      where: { name: 'admin' }
    })
    
    if (!adminRole) {
      console.log('Admin role not found!')
      return
    }
    
    // Check if user already has admin role
    const existingAssignment = await prisma.userRoleAssignment.findUnique({
      where: {
        unique_user_role: {
          userId: user.id,
          roleId: adminRole.id
        }
      }
    })
    
    if (existingAssignment) {
      console.log('User already has admin role!')
      return
    }
    
    // Assign admin role
    await prisma.userRoleAssignment.create({
      data: {
        userId: user.id,
        roleId: adminRole.id,
        isActive: true
      }
    })
    
    console.log('Admin role assigned successfully!')
    
    // Verify the assignment
    const userWithRoles = await prisma.user.findUnique({
      where: { email },
      include: {
        roleAssignments: {
          include: {
            role: true
          }
        }
      }
    })
    
    console.log('User roles:')
    userWithRoles?.roleAssignments.forEach(assignment => {
      console.log(`- ${assignment.role.name} (Active: ${assignment.isActive})`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

assignAdminRole()