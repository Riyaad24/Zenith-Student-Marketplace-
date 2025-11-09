const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixAllProductImages() {
  try {
    console.log('🔍 Finding products with missing cover images...\n');
    
    // Get all active products
    const products = await prisma.product.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        title: true,
        image: true,
        images: true
      }
    });

    console.log(`Found ${products.length} active products\n`);

    for (const product of products) {
      console.log(`\n📦 Product: ${product.title}`);
      console.log(`   Current image field: ${product.image ? 'SET' : 'NULL'}`);
      
      // Check if image field is null or empty
      if (!product.image && product.images) {
        try {
          const imagesArray = JSON.parse(product.images);
          
          if (Array.isArray(imagesArray) && imagesArray.length > 0) {
            console.log(`   Images array has ${imagesArray.length} items`);
            console.log(`   First image: ${imagesArray[0].substring(0, 60)}...`);
            
            // Update the product with the first image
            await prisma.product.update({
              where: { id: product.id },
              data: { image: imagesArray[0] }
            });
            
            console.log(`   ✅ Updated cover image`);
          } else {
            console.log(`   ⚠️  Images array is empty`);
          }
        } catch (e) {
          console.log(`   ❌ Failed to parse images: ${e.message}`);
        }
      } else if (!product.image && !product.images) {
        console.log(`   ⚠️  No images available`);
      } else {
        console.log(`   ✓ Already has cover image`);
      }
    }

    console.log('\n✅ Done!\n');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAllProductImages();
