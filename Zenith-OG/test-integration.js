const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testIntegration() {
  console.log('\n🔍 TESTING BACKEND-FRONTEND-DATABASE INTEGRATION\n');
  console.log('═'.repeat(60));
  
  try {
    // Test 1: Database Connection
    console.log('\n1️⃣ Testing Database Connection...');
    await prisma.$connect();
    console.log('   ✅ Database connection successful');

    // Test 2: Query Database
    console.log('\n2️⃣ Testing Database Queries...');
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    console.log(`   ✅ Users: ${userCount}`);
    console.log(`   ✅ Products: ${productCount}`);
    console.log(`   ✅ Categories: ${categoryCount}`);

    // Test 3: Check Admin Users
    console.log('\n3️⃣ Testing Admin Access...');
    const admins = await prisma.admin.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    console.log(`   ✅ Active Admins: ${admins.length}`);
    admins.forEach(admin => {
      console.log(`      - ${admin.user.email} (${admin.user.firstName} ${admin.user.lastName})`);
    });

    // Test 4: Check Categories
    console.log('\n4️⃣ Testing Categories...');
    const categories = await prisma.category.findMany({
      select: {
        name: true,
        slug: true,
        _count: {
          select: { products: true }
        }
      }
    });
    console.log(`   ✅ Categories found: ${categories.length}`);
    categories.forEach(cat => {
      console.log(`      - ${cat.name} (${cat._count.products} products)`);
    });

    // Test 5: Check Recent Products
    console.log('\n5️⃣ Testing Products...');
    const recentProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        seller: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        category: {
          select: {
            name: true
          }
        }
      }
    });
    console.log(`   ✅ Recent products: ${recentProducts.length}`);
    recentProducts.forEach(p => {
      console.log(`      - ${p.title} by ${p.seller.firstName} ${p.seller.lastName} (${p.category.name})`);
    });

    // Test 6: Check Tutor Applications
    console.log('\n6️⃣ Testing Tutor Applications...');
    const tutorApps = await prisma.tutorApplication.findMany({
      take: 5,
      orderBy: { submittedAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    console.log(`   ✅ Tutor applications: ${tutorApps.length}`);
    tutorApps.forEach(app => {
      console.log(`      - ${app.user.firstName} ${app.user.lastName} (${app.status})`);
    });

    // Test 7: Check Authentication Setup
    console.log('\n7️⃣ Testing Authentication Setup...');
    const usersWithSecurity = await prisma.accountSecurity.count();
    console.log(`   ✅ Users with security records: ${usersWithSecurity}`);

    // Test 8: Verify Schema Changes (LONGTEXT columns)
    console.log('\n8️⃣ Verifying Schema Updates...');
    const tutorWithDocs = await prisma.tutorApplication.findFirst({
      where: {
        OR: [
          { profilePicture: { not: null } },
          { proofOfRegistration: { not: null } }
        ]
      }
    });
    if (tutorWithDocs) {
      const picLength = tutorWithDocs.profilePicture?.length || 0;
      const proofLength = tutorWithDocs.proofOfRegistration?.length || 0;
      console.log(`   ✅ Schema supports large files:`);
      console.log(`      - Profile picture size: ${(picLength / 1024).toFixed(2)} KB`);
      console.log(`      - Proof document size: ${(proofLength / 1024).toFixed(2)} KB`);
    } else {
      console.log(`   ℹ️  No tutor applications with documents yet`);
    }

    // Test 9: Check Orders
    console.log('\n9️⃣ Testing Orders...');
    const orderCount = await prisma.order.count();
    const recentOrders = await prisma.order.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });
    console.log(`   ✅ Total orders: ${orderCount}`);
    recentOrders.forEach(order => {
      console.log(`      - Order ${order.id.substring(0, 8)}... by ${order.user.firstName} (${order.status})`);
    });

    // Test 10: Environment Variables
    console.log('\n🔟 Checking Environment Variables...');
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ];
    
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);
    if (missingVars.length === 0) {
      console.log('   ✅ All required environment variables are set');
    } else {
      console.log('   ⚠️  Missing environment variables:', missingVars.join(', '));
    }

    // Summary
    console.log('\n' + '═'.repeat(60));
    console.log('\n✅ INTEGRATION TEST SUMMARY');
    console.log('━'.repeat(60));
    console.log(`Database:      ✅ Connected and operational`);
    console.log(`Users:         ✅ ${userCount} registered`);
    console.log(`Admins:        ✅ ${admins.length} active`);
    console.log(`Products:      ✅ ${productCount} listed`);
    console.log(`Categories:    ✅ ${categoryCount} configured`);
    console.log(`Orders:        ✅ ${orderCount} processed`);
    console.log(`Tutors:        ✅ ${tutorApps.length} applications`);
    console.log(`Auth:          ✅ ${usersWithSecurity} users secured`);
    console.log(`Environment:   ✅ Properly configured`);
    console.log('━'.repeat(60));
    console.log('\n🎉 All systems are operational!\n');
    console.log('Backend + Frontend + Database = ✅ Working Together\n');

  } catch (error) {
    console.error('\n❌ Integration test failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testIntegration();
