const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateApprovedProducts() {
  try {
    console.log('Looking for products with status "approved"...')
    
    const result = await prisma.product.updateMany({
      where: {
        status: 'approved'
      },
      data: {
        status: 'active'
      }
    })
    
    console.log(`✓ Updated ${result.count} products from "approved" to "active"`)
    
    // Show updated products
    const updatedProducts = await prisma.product.findMany({
      where: {
        status: 'active',
        adminApproved: true
      },
      select: {
        id: true,
        title: true,
        status: true,
        adminApproved: true
      }
    })
    
    console.log('\nActive approved products:')
    updatedProducts.forEach(p => {
      console.log(`  - ${p.title} (${p.id}) - Status: ${p.status}, Admin Approved: ${p.adminApproved}`)
    })
    
  } catch (error) {
    console.error('Error updating products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateApprovedProducts()
