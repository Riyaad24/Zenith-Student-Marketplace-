const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Team admin accounts
const teamAdmins = [
// Sanitized sample seed file for production-safe commits.
// This file provides example data structure without real user PII or passwords.

const sampleUsers = [
  { firstName: 'Sample', lastName: 'Student', email: 'sample1@example.com', password: 'SamplePass123!', studentNumber: 'SAMPLE001' },
  { firstName: 'Example', lastName: 'User', email: 'sample2@example.com', password: 'ExamplePass123!', studentNumber: 'SAMPLE002' }
]

async function seed(prisma) {
  const bcrypt = require('bcrypt')
  const salt = await bcrypt.genSalt(12)

  for (const u of sampleUsers) {
    const passwordHash = await bcrypt.hash(u.password, salt)
    await prisma.user.create({
      data: {
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        studentNumber: u.studentNumber,
        // store hash in separate security table depending on your schema
        security: {
          create: { passwordHash }
        }
      }
    })
  }

  console.log('✅ Seeded sample users (sanitized).')
}

module.exports = { seed }
]

async function seedDatabase() {
  try {
    console.log('🚀 Initializing Zenith Marketplace Database...')

    // Create categories
    console.log('📁 Setting up product categories...')
    const textbooksCategory = await prisma.category.upsert({
      where: { slug: 'textbooks' },
      update: {},
      create: {
        name: 'Textbooks',
        slug: 'textbooks',
        description: 'Academic textbooks for all subjects',
        image: '/images/textbooks.jpg'
      }
    })

    const electronicsCategory = await prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Laptops, phones, tablets, and accessories',
        image: '/images/electronics.jpg'
      }
    })

    const notesCategory = await prisma.category.upsert({
      where: { slug: 'notes' },
      update: {},
      create: {
        name: 'Notes & Study Guides',
        slug: 'notes',
        description: 'Class notes, study guides, and past papers',
        image: '/images/notes.jpg'
      }
    })

    console.log('✅ Product categories initialized')

    // Create admin role
    console.log('🔐 Setting up admin role...')
    const adminRole = await prisma.userRole.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        description: 'Administrator role with full access',
        permissions: JSON.stringify(['admin', 'read', 'create', 'update', 'delete'])
      }
    })
    console.log('✅ Admin role created')

    // Create admin users
    console.log(`👥 Registering ${teamAdmins.length} admin accounts...`)
    const adminUsers = []
    
    for (const admin of teamAdmins) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: admin.email }
      })

      if (existingUser) {
        console.log(`  ⏭️  ${admin.firstName} ${admin.lastName} (already exists)`)
        adminUsers.push(existingUser)
        continue
      }

      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(admin.password, salt)
      
      const user = await prisma.user.create({
        data: {
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          university: 'Richfield Graduate Institute',
          location: 'Pretoria',
          bio: `Admin - ${admin.firstName} ${admin.lastName}`,
          verified: true,
          adminVerified: true,
          documentsUploaded: true,
          security: {
            create: {
              passwordHash: passwordHash,
              salt: salt,
              emailVerified: true
            }
          },
          admin: {
            create: {
              studentNumber: admin.studentNumber,
              permissions: ['*'],
              isActive: true
            }
          },
          roleAssignments: {
            create: {
              roleId: adminRole.id
            }
          }
        }
      })
      adminUsers.push(user)
      console.log(`  ✅ ${admin.firstName} ${admin.lastName}`)
    }

    console.log('✅ All admin accounts registered')

    // No regular users - will be created through registration
    console.log('👥 No regular users - ready for new registrations')

    // No products - will be created by users
    console.log('📦 No products - ready for new listings')

    console.log('✅ Database initialized for production use')

    // Summary
    const userCount = await prisma.user.count()
    const adminCount = await prisma.admin.count()
    const productCount = await prisma.product.count()
    const categoryCount = await prisma.category.count()

    console.log('\n✅ Zenith Marketplace Database Initialized!')
    console.log('📊 Current Marketplace Status:')
    console.log(`   👥 Total Users: ${userCount}`)
    console.log(`   � Admin Accounts: ${adminCount}`)
    console.log(`   �📦 Listed Products: ${productCount}`)
    console.log(`   📁 Product Categories: ${categoryCount}`)
    console.log('\n👨‍💼 Admin Team Members (Full Access):')
    teamAdmins.forEach(admin => {
      console.log(`   • ${admin.firstName} ${admin.lastName} - ${admin.email}`)
    })
    console.log('\n🎉 Your marketplace is ready for user registrations and product listings!')

  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
