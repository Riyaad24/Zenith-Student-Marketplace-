const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkImageData() {
  try {
    const product = await prisma.product.findFirst({
      where: { 
        title: { contains: 'HP' } 
      }
    });

    if (product) {
      console.log('\n=== HP ProBook Product Data ===');
      console.log('ID:', product.id);
      console.log('Title:', product.title);
      console.log('\nImage field (first 100 chars):');
      console.log(product.image ? product.image.substring(0, 100) : 'NULL');
      console.log('\nImages field (first 100 chars):');
      console.log(product.images ? product.images.substring(0, 100) : 'NULL');
      console.log('\nImages field type:', typeof product.images);
      
      if (product.images) {
        try {
          const parsed = JSON.parse(product.images);
          console.log('\nParsed images array:', Array.isArray(parsed) ? `Array with ${parsed.length} items` : 'Not an array');
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log('First image (first 100 chars):', parsed[0].substring(0, 100));
          }
        } catch (e) {
          console.log('\nFailed to parse images as JSON:', e.message);
        }
      }
    } else {
      console.log('No HP product found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImageData();
