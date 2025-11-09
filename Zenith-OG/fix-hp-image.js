const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixHPImage() {
  try {
    const product = await prisma.product.findFirst({
      where: { title: { contains: 'HP' } }
    });

    if (product) {
      console.log('Current images:', product.images);
      
      // Parse the existing images
      const images = JSON.parse(product.images);
      console.log('\nParsed images:', images);
      
      // Update the product to also set the main image field
      await prisma.product.update({
        where: { id: product.id },
        data: {
          image: images[0] // Set the first image as the main image
        }
      });
      
      console.log('\n✅ Updated product with main image:', images[0]);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixHPImage();
