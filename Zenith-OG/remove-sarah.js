const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function removeUser() {
  try {
    console.log('🗑️  Removing Sarah Jones...')
    
    const user = await prisma.user.findUnique({
      where: { email: 'sarah.jones@wits.ac.za' },
      include: {
        products: true,
        security: true
      }
    })

    if (!user) {
      console.log('ℹ️  Sarah Jones not found in database')
      return
    }

    // Delete associated products first
    if (user.products.length > 0) {
      await prisma.product.deleteMany({
        where: { sellerId: user.id }
      })
      console.log(`  🗑️  Deleted ${user.products.length} product(s)`)
    }

    // Delete security record
    if (user.security) {
      await prisma.accountSecurity.delete({
        where: { userId: user.id }
      })
      console.log('  🗑️  Deleted security record')
    }

    // Delete user
    await prisma.user.delete({
      where: { id: user.id }
    })

    console.log('✅ Sarah Jones removed successfully')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

removeUser()
