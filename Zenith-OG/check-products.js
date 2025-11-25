const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkProducts() {
  try {
    // Find Riyaad's user
    const riyaad = await prisma.user.findUnique({
      where: { email: '402306532ads@my.richfield.ac.za' },
      include: {
        products: {
          include: {
            category: true
          }
        }
      }
    })

    if (!riyaad) {
      console.log('❌ Riyaad not found')
      return
    }

    console.log(`\n👤 User: ${riyaad.firstName} ${riyaad.lastName}`)
    console.log(`📧 Email: ${riyaad.email}`)
    console.log(`\n📦 Current Products (${riyaad.products.length}):`)
    
    if (riyaad.products.length === 0) {
      console.log('   No products found')
    } else {
      riyaad.products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.title}`)
        console.log(`   Category: ${product.category.name}`)
        console.log(`   Price: R${product.price}`)
        console.log(`   Condition: ${product.condition}`)
        console.log(`   Status: ${product.status}`)
        console.log(`   Description: ${product.description.substring(0, 100)}...`)
      })
    }

    // Show all products in database
    const allProducts = await prisma.product.findMany({
      include: {
        seller: true,
        category: true
      }
    })

    console.log(`\n\n📊 All Products in Database (${allProducts.length}):`)
    allProducts.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.title}`)
      console.log(`   Seller: ${product.seller.firstName} ${product.seller.lastName}`)
      console.log(`   Category: ${product.category.name}`)
      console.log(`   Price: R${product.price}`)
    })

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkProducts()
