const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function cleanup() {
  try {
    console.log('🗑️  Cleaning up database...')
    
    // Remove John Smith
    const john = await prisma.user.findUnique({
      where: { email: 'john.smith@uct.ac.za' }
    })

    if (john) {
      // Delete his products first
      const deletedProducts = await prisma.product.deleteMany({
        where: { sellerId: john.id }
      })
      console.log(`  🗑️  Deleted ${deletedProducts.count} product(s) from John Smith`)

      // Delete security record
      await prisma.accountSecurity.delete({
        where: { userId: john.id }
      })

      // Delete user
      await prisma.user.delete({
        where: { id: john.id }
      })
      console.log('  ✅ John Smith removed')
    } else {
      console.log('  ℹ️  John Smith not found')
    }

    // Delete all remaining products
    const allProducts = await prisma.product.deleteMany({})
    console.log(`  🗑️  Deleted all ${allProducts.count} remaining product(s)`)

    // Summary
    const userCount = await prisma.user.count()
    const adminCount = await prisma.admin.count()
    const productCount = await prisma.product.count()

    console.log('\n✅ Cleanup complete!')
    console.log('📊 Current database:')
    console.log(`   👥 Total Users: ${userCount}`)
    console.log(`   🔐 Admin Accounts: ${adminCount}`)
    console.log(`   📦 Products: ${productCount}`)

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

cleanup()
