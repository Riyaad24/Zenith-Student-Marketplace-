// Check roles and user role assignments
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkRoles() {
  try {
    console.log('=== Available Roles ===')
    const roles = await prisma.userRole.findMany()
    
    console.log(`Found ${roles.length} roles:`)
    roles.forEach(role => {
      console.log(`- ID: ${role.id}, Name: ${role.name}, Active: ${role.isActive}`)
      console.log(`  Permissions: ${JSON.stringify(role.permissions)}`)
    })
    
    console.log('\n=== User Role Assignments ===')
    const assignments = await prisma.userRoleAssignment.findMany({
      include: {
        user: true,
        role: true
      }
    })
    
    console.log(`Found ${assignments.length} role assignments:`)
    assignments.forEach(assignment => {
      console.log(`- User: ${assignment.user.email} -> Role: ${assignment.role.name}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkRoles()