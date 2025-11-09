const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Team admin accounts
const teamAdmins = [
  { firstName: 'Riyaad', lastName: 'Dollie', email: '402306532ads@my.richfield.ac.za', password: 'StudentPass123!', studentNumber: '402306532' },
  { firstName: 'Katlego', lastName: 'Mthimkulu', email: '402306606ads@my.richfield.ac.za', password: 'Katlego@21', studentNumber: '402306606' },
  { firstName: 'Zukhanye', lastName: 'May', email: '402306545ads@my.richfield.ac.za', password: 'Zukhanye1.', studentNumber: '402306545' },
  { firstName: 'Lethabo', lastName: 'Maesela', email: '402306346ads@my.richfield.ac.za', password: 'Lethabo700#', studentNumber: '402306346' },
  { firstName: 'Khumoetsile', lastName: 'Mmatli', email: '402306701ads@my.richfield.ac.za', password: 'Khumo@101', studentNumber: '402306701' },
  { firstName: 'Rose', lastName: 'Madhlalati', email: '402306684ads@my.richfield.ac.za', password: 'Lesedi@_40%', studentNumber: '402306684' },
  { firstName: 'Lilitha', lastName: 'Sobuza', email: '402306756ads@my.richfield.ac.za', password: 'Lilitha060', studentNumber: '402306756' },
  { firstName: 'Walter', lastName: 'Hlahla', email: '402306613ads@my.richfield.ac.za', password: 'KARAbo@09', studentNumber: '402306613' },
  { firstName: 'Mugwambani', lastName: 'Ndzalama', email: '402306709ads@my.richfield.ac.za', password: 'Skyler@21', studentNumber: '402306709' },
  { firstName: 'Tshwanelo', lastName: 'Dise', email: '402306367ads@my.richfield.ac.za', password: 'Thato@14', studentNumber: '402306367' },
  { firstName: 'Sbonelo', lastName: 'Ndengu', email: '402306198ads@my.richfield.ac.za', password: 'DTbi22#$', studentNumber: '402306198' },
  { firstName: 'Ntlakuso', lastName: 'Maluleke', email: '402306695ads@my.richfield.ac.za', password: 'A2d4c', studentNumber: '402306695' },
  { firstName: 'Raymundo', lastName: 'Rodnell', email: '402411533ads@my.richfield.ac.za', password: 'cl@yton123', studentNumber: '402411533' }
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
