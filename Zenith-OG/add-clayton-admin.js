const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addClaytonAdmin() {
  try {
    const adminEmail = '402411533ads@my.richfield.ac.za';
    const password = 'Cl@yton123';
    const studentNumber = '402411533';
    
    console.log('🔍 Checking if user exists...');
    
    // Check if user already exists
    let existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
      include: {
        security: true,
        admin: true,
        roleAssignments: {
          include: {
            role: true
          }
        }
      }
    });

    if (existingUser) {
      console.log('✅ User already exists:', adminEmail);
      
      // Update password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      
      await prisma.accountSecurity.update({
        where: { userId: existingUser.id },
        data: {
          passwordHash,
          salt,
          emailVerified: true,
        }
      });
      
      console.log('🔑 Password updated');
      
      // Check if admin record exists
      if (!existingUser.admin) {
        console.log('📝 Creating admin record...');
        await prisma.admin.create({
          data: {
            userId: existingUser.id,
            studentNumber: studentNumber,
            permissions: ['*'], // Full permissions
            isActive: true
          }
        });
        console.log('✅ Admin record created');
      } else {
        console.log('✅ Admin record already exists');
        // Update to ensure full permissions
        await prisma.admin.update({
          where: { id: existingUser.admin.id },
          data: {
            studentNumber: studentNumber,
            permissions: ['*'],
            isActive: true
          }
        });
        console.log('✅ Admin permissions updated to full access');
      }
      
      // Check if admin role exists
      const hasAdminRole = existingUser.roleAssignments.some(
        ra => ra.role.name === 'admin'
      );
      
      if (!hasAdminRole) {
        console.log('� Assigning admin role...');
        let adminRole = await prisma.userRole.findUnique({
          where: { name: 'admin' }
        });

        if (!adminRole) {
          adminRole = await prisma.userRole.create({
            data: {
              name: 'admin',
              description: 'Administrator role with full access',
              permissions: JSON.stringify(['admin', 'read', 'create', 'update', 'delete'])
            }
          });
        }

        await prisma.userRoleAssignment.create({
          data: {
            userId: existingUser.id,
            roleId: adminRole.id,
          }
        });
        console.log('✅ Admin role assigned');
      } else {
        console.log('✅ Already has admin role');
      }
      
      console.log('\n✅ Admin setup complete!');
      console.log('Email:', adminEmail);
      console.log('Password:', password);
      console.log('Student Number:', studentNumber);
      return;
    }

    console.log('📝 Creating new admin user...');

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    await prisma.$transaction(async (tx) => {
      // Create user profile
      const user = await tx.user.create({
        data: {
          email: adminEmail,
          firstName: 'Clayton',
          lastName: 'Admin',
          university: 'Richfield Graduate Institute',
          verified: true,
          adminVerified: true,
        },
      });

      console.log('✅ User profile created');

      // Create security record
      await tx.accountSecurity.create({
        data: {
          userId: user.id,
          passwordHash,
          salt,
          emailVerified: true,
        },
      });

      console.log('✅ Security record created');

      // Create admin record
      await tx.admin.create({
        data: {
          userId: user.id,
          studentNumber: studentNumber,
          permissions: ['*'], // Full permissions with wildcard
          isActive: true
        }
      });

      console.log('✅ Admin record created');

      // Find or create admin role
      let adminRole = await tx.userRole.findUnique({
        where: { name: 'admin' }
      });

      if (!adminRole) {
        adminRole = await tx.userRole.create({
          data: {
            name: 'admin',
            description: 'Administrator role with full access',
            permissions: JSON.stringify(['admin', 'read', 'create', 'update', 'delete'])
          }
        });
        console.log('✅ Admin role created');
      }

      // Assign admin role
      await tx.userRoleAssignment.create({
        data: {
          userId: user.id,
          roleId: adminRole.id,
        },
      });

      console.log('✅ Admin role assigned');
    });

    console.log('\n🎉 Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', adminEmail);
    console.log('Password:', password);
    console.log('Student Number:', studentNumber);
    console.log('Permissions: Full Access (*)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ You can now log in to the admin portal');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    console.error('Full error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addClaytonAdmin();
