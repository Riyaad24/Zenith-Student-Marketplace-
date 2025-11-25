const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Team admin accounts
const teamAdmins = [
  {
    firstName: 'Katlego',
    lastName: 'Mthimkulu',
    email: '402306606ads@my.richfield.ac.za',
    password: 'Katlego@21',
    studentNumber: '402306606'
  },
  {
    firstName: 'Zukhanye',
    lastName: 'May',
    email: '402306545ads@my.richfield.ac.za',
    password: 'Zukhanye1.',
    studentNumber: '402306545'
  },
  {
    firstName: 'Lethabo',
    lastName: 'Maesela',
    email: '402306346ads@my.richfield.ac.za',
    password: 'Lethabo700#',
    studentNumber: '402306346'
  },
  {
    firstName: 'Khumoetsile',
    lastName: 'Mmatli',
    email: '402306701ads@my.richfield.ac.za',
    password: 'Khumo@101',
    studentNumber: '402306701'
  },
  {
    firstName: 'Rose',
    lastName: 'Madhlalati',
    email: '402306684ads@my.richfield.ac.za',
    password: 'Lesedi@_40%',
    studentNumber: '402306684'
  },
  {
    firstName: 'Lilitha',
    lastName: 'Sobuza',
    email: '402306756ads@my.richfield.ac.za',
    password: 'Lilitha060',
    studentNumber: '402306756'
  },
  {
    firstName: 'Walter',
    lastName: 'Hlahla',
    email: '402306613ads@my.richfield.ac.za',
    password: 'KARAbo@09',
    studentNumber: '402306613'
  },
  {
    firstName: 'Mugwambani',
    lastName: 'Ndzalama',
    email: '402306709ads@my.richfield.ac.za',
    password: 'Skyler@21',
    studentNumber: '402306709'
  },
  {
    firstName: 'Tshwanelo',
    lastName: 'Dise',
    email: '402306367ads@my.richfield.ac.za',
    password: 'Thato@14',
    studentNumber: '402306367'
  },
  {
    firstName: 'Sbonelo',
    lastName: 'Ndengu',
    email: '402306198ads@my.richfield.ac.za',
    password: 'DTbi22#$',
    studentNumber: '402306198'
  },
  {
    firstName: 'Ntlakuso',
    lastName: 'Maluleke',
    email: '402306695ads@my.richfield.ac.za',
    password: 'A2d4c',
    studentNumber: '402306695'
  },
  {
    firstName: 'Raymundo',
    lastName: 'Rodnell',
    email: '402411533ads@my.richfield.ac.za',
    password: 'cl@yton123',
    studentNumber: '402411533'
  }
]

async function addAdmin(adminData) {
  const { email, password, firstName, lastName, studentNumber } = adminData
  
  try {
    console.log(`\n🔍 Processing: ${firstName} ${lastName} (${email})`)
    
    // Check if user already exists
    let existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        security: true,
        admin: true,
        roleAssignments: {
          include: {
            role: true
          }
        }
      }
    })

    if (existingUser) {
      console.log('  ℹ️  User already exists - updating...')
      
      // Update password
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)
      
      await prisma.accountSecurity.update({
        where: { userId: existingUser.id },
        data: {
          passwordHash,
          salt,
          emailVerified: true,
        }
      })
      
      console.log('  🔑 Password updated')
      
      // Update user details
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          firstName,
          lastName,
          verified: true,
          adminVerified: true
        }
      })
      
      // Check/create admin record
      if (!existingUser.admin) {
        await prisma.admin.create({
          data: {
            userId: existingUser.id,
            studentNumber: studentNumber,
            permissions: ['*'],
            isActive: true
          }
        })
        console.log('  ✅ Admin record created')
      } else {
        await prisma.admin.update({
          where: { id: existingUser.admin.id },
          data: {
            studentNumber: studentNumber,
            permissions: ['*'],
            isActive: true
          }
        })
        console.log('  ✅ Admin permissions updated')
      }
      
      // Check/assign admin role
      const hasAdminRole = existingUser.roleAssignments.some(
        ra => ra.role.name === 'admin'
      )
      
      if (!hasAdminRole) {
        let adminRole = await prisma.userRole.findUnique({
          where: { name: 'admin' }
        })

        if (!adminRole) {
          adminRole = await prisma.userRole.create({
            data: {
              name: 'admin',
              description: 'Administrator role with full access',
              permissions: JSON.stringify(['admin', 'read', 'create', 'update', 'delete'])
            }
          })
        }

        await prisma.userRoleAssignment.create({
          data: {
            userId: existingUser.id,
            roleId: adminRole.id,
          }
        })
        console.log('  ✅ Admin role assigned')
      }
      
      return { success: true, created: false }
    }

    // Create new admin user
    console.log('  📝 Creating new admin user...')

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          firstName,
          lastName,
          university: 'Richfield Graduate Institute',
          verified: true,
          adminVerified: true,
        },
      })

      // Create security record
      await tx.accountSecurity.create({
        data: {
          userId: user.id,
          passwordHash,
          salt,
          emailVerified: true,
        },
      })

      // Create admin record
      await tx.admin.create({
        data: {
          userId: user.id,
          studentNumber: studentNumber,
          permissions: ['*'],
          isActive: true
        }
      })

      // Find or create admin role
      let adminRole = await tx.userRole.findUnique({
        where: { name: 'admin' }
      })

      if (!adminRole) {
        adminRole = await tx.userRole.create({
          data: {
            name: 'admin',
            description: 'Administrator role with full access',
            permissions: JSON.stringify(['admin', 'read', 'create', 'update', 'delete'])
          }
        })
      }

      // Assign admin role
      await tx.userRoleAssignment.create({
        data: {
          userId: user.id,
          roleId: adminRole.id,
        },
      })
    })

    console.log('  ✅ Admin created successfully!')
    return { success: true, created: true }

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗')
  console.log('║   Zenith Admin Portal - Add Team Admins               ║')
  console.log('╚════════════════════════════════════════════════════════╝')
  console.log(`\nAdding ${teamAdmins.length} admin accounts...\n`)

  const results = []

  for (const admin of teamAdmins) {
    const result = await addAdmin(admin)
    results.push({
      name: `${admin.firstName} ${admin.lastName}`,
      email: admin.email,
      ...result
    })
  }

  console.log('\n╔════════════════════════════════════════════════════════╗')
  console.log('║                    Summary Report                      ║')
  console.log('╚════════════════════════════════════════════════════════╝\n')

  const created = results.filter(r => r.success && r.created).length
  const updated = results.filter(r => r.success && !r.created).length
  const failed = results.filter(r => !r.success).length

  results.forEach(({ name, email, success, created, error }) => {
    if (success) {
      const status = created ? '🆕 Created' : '🔄 Updated'
      console.log(`✅ ${status} - ${name}`)
      console.log(`   ${email}`)
    } else {
      console.log(`❌ Failed - ${name}`)
      console.log(`   ${email}`)
      console.log(`   Error: ${error}`)
    }
  })

  console.log('\n─────────────────────────────────────────────────────────')
  console.log(`📊 Results: ${created} created, ${updated} updated, ${failed} failed`)
  console.log('─────────────────────────────────────────────────────────\n')

  await prisma.$disconnect()
}

main()
