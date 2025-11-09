const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function addAdmin(email, password, firstName, lastName, studentNumber, university = 'Richfield Graduate Institute') {
  try {
    console.log(`\n🔍 Processing admin: ${email}`)
    
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
      console.log('  ✅ User already exists')
      
      // Update password if provided
      if (password) {
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
      }
      
      // Check if admin record exists
      if (!existingUser.admin) {
        console.log('  📝 Creating admin record...')
        await prisma.admin.create({
          data: {
            userId: existingUser.id,
            studentNumber: studentNumber,
            permissions: ['*'], // Full permissions
            isActive: true
          }
        })
        console.log('  ✅ Admin record created')
      } else {
        // Update admin record to ensure full permissions
        await prisma.admin.update({
          where: { id: existingUser.admin.id },
          data: {
            studentNumber: studentNumber,
            permissions: ['*'],
            isActive: true
          }
        })
        console.log('  ✅ Admin permissions updated to full access')
      }
      
      // Check if admin role exists
      const hasAdminRole = existingUser.roleAssignments.some(
        ra => ra.role.name === 'admin'
      )
      
      if (!hasAdminRole) {
        console.log('  📝 Assigning admin role...')
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
      } else {
        console.log('  ✅ Already has admin role')
      }
      
      return { success: true, created: false }
    }

    // Create new admin user
    console.log('  📝 Creating new admin user...')

    // Hash password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const adminUser = await prisma.$transaction(async (tx) => {
      // Create user profile
      const user = await tx.user.create({
        data: {
          email,
          firstName,
          lastName,
          university,
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
          permissions: ['*'], // Full permissions with wildcard
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

      return user
    })

    console.log('  ✅ Admin user created successfully!')
    return { success: true, created: true }

  } catch (error) {
    console.error('  ❌ Error:', error.message)
    return { success: false, error: error.message }
  }
}

async function interactiveMode() {
  console.log('\n╔════════════════════════════════════════════════╗')
  console.log('║   Zenith Admin Portal - Add Admin Users       ║')
  console.log('╚════════════════════════════════════════════════╝\n')

  const results = []

  while (true) {
    console.log('\n─────────────────────────────────────────────────')
    const email = await question('Admin Email (or "done" to finish): ')
    
    if (email.toLowerCase() === 'done' || email.toLowerCase() === 'exit' || email.toLowerCase() === 'q') {
      break
    }

    if (!email.includes('@')) {
      console.log('❌ Invalid email format')
      continue
    }

    const password = await question('Password: ')
    if (!password) {
      console.log('❌ Password is required')
      continue
    }

    const firstName = await question('First Name: ')
    const lastName = await question('Last Name: ')
    
    // Extract student number from email if it matches pattern
    const match = email.match(/^(\d{9})ads@my\.richfield\.ac\.za$/)
    let studentNumber
    
    if (match) {
      studentNumber = match[1]
      console.log(`  → Detected student number: ${studentNumber}`)
    } else {
      studentNumber = await question('Student Number (9 digits): ')
    }

    const university = await question('University (press Enter for "Richfield Graduate Institute"): ')

    const result = await addAdmin(
      email,
      password,
      firstName || 'Admin',
      lastName || 'User',
      studentNumber,
      university || 'Richfield Graduate Institute'
    )

    results.push({ email, ...result })

    console.log('\n' + (result.success ? '✅ Success!' : '❌ Failed!'))
  }

  console.log('\n╔════════════════════════════════════════════════╗')
  console.log('║              Summary                           ║')
  console.log('╚════════════════════════════════════════════════╝\n')

  results.forEach(({ email, success, created, error }) => {
    if (success) {
      console.log(`✅ ${email} - ${created ? 'Created' : 'Updated'}`)
    } else {
      console.log(`❌ ${email} - Failed: ${error}`)
    }
  })

  console.log('\n')
}

async function batchMode(admins) {
  console.log('\n╔════════════════════════════════════════════════╗')
  console.log('║   Zenith Admin Portal - Batch Add Admins      ║')
  console.log('╚════════════════════════════════════════════════╝\n')

  const results = []

  for (const admin of admins) {
    const result = await addAdmin(
      admin.email,
      admin.password,
      admin.firstName || 'Admin',
      admin.lastName || 'User',
      admin.studentNumber,
      admin.university || 'Richfield Graduate Institute'
    )

    results.push({ email: admin.email, ...result })
  }

  console.log('\n╔════════════════════════════════════════════════╗')
  console.log('║              Summary                           ║')
  console.log('╚════════════════════════════════════════════════╝\n')

  results.forEach(({ email, success, created, error }) => {
    if (success) {
      console.log(`✅ ${email} - ${created ? 'Created' : 'Updated'}`)
    } else {
      console.log(`❌ ${email} - Failed: ${error}`)
    }
  })

  console.log('\n')
}

async function main() {
  // Check if batch mode data is provided via command line argument
  const batchData = process.argv[2]

  if (batchData) {
    try {
      const admins = JSON.parse(batchData)
      await batchMode(admins)
    } catch (error) {
      console.error('❌ Invalid batch data format. Expected JSON array.')
      console.log('\nExample:')
      console.log('node add-admin-interactive.js \'[{"email":"test@example.com","password":"Pass123!","firstName":"John","lastName":"Doe","studentNumber":"123456789"}]\'')
    }
  } else {
    await interactiveMode()
  }

  rl.close()
  await prisma.$disconnect()
}

main()
