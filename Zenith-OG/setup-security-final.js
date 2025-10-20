const mysql = require('mysql2/promise');

async function setupSecurity() {
  const connection = await mysql.createConnection('mysql://root:Riyaad24*@localhost:3306/zenith_marketplace');
  
  try {
    console.log('🔐 Setting up security roles...');
    
    // Insert default user roles with proper JSON formatting
    const roles = [
      {
        id: 'clr1_super_admin',
        name: 'super_admin',
        description: 'Full system access with all privileges',
        permissions: JSON.stringify({
          users: ['create', 'read', 'update', 'delete', 'manage_roles'],
          products: ['create', 'read', 'update', 'delete', 'moderate'],
          orders: ['create', 'read', 'update', 'delete', 'refund'],
          categories: ['create', 'read', 'update', 'delete'],
          system: ['backup', 'restore', 'configure', 'monitor'],
          security: ['view_logs', 'manage_permissions', 'system_admin']
        })
      },
      {
        id: 'clr2_admin',
        name: 'admin',
        description: 'Administrative access for platform management',
        permissions: JSON.stringify({
          users: ['create', 'read', 'update', 'suspend'],
          products: ['read', 'update', 'moderate', 'feature'],
          orders: ['read', 'update', 'process', 'refund'],
          categories: ['create', 'read', 'update'],
          reports: ['view', 'export'],
          security: ['view_logs']
        })
      },
      {
        id: 'clr3_moderator',
        name: 'moderator',
        description: 'Content moderation and user management',
        permissions: JSON.stringify({
          users: ['read', 'moderate', 'warn'],
          products: ['read', 'moderate', 'approve', 'reject'],
          orders: ['read', 'view_disputes'],
          reports: ['view', 'moderate']
        })
      },
      {
        id: 'clr4_seller',
        name: 'seller',
        description: 'Seller privileges for product and order management',
        permissions: JSON.stringify({
          products: ['create', 'read', 'update', 'delete_own'],
          orders: ['read_own', 'update_own', 'fulfill'],
          analytics: ['view_own'],
          messages: ['send', 'receive']
        })
      },
      {
        id: 'clr5_buyer',
        name: 'buyer',
        description: 'Standard buyer privileges',
        permissions: JSON.stringify({
          products: ['read', 'search', 'review'],
          orders: ['create', 'read_own', 'cancel_own'],
          cart: ['manage'],
          messages: ['send', 'receive']
        })
      },
      {
        id: 'clr6_student',
        name: 'student',
        description: 'Enhanced student privileges with special features',
        permissions: JSON.stringify({
          products: ['read', 'search', 'review', 'create_textbook_listings'],
          orders: ['create', 'read_own', 'cancel_own'],
          cart: ['manage'],
          messages: ['send', 'receive'],
          student_features: ['access_student_discounts', 'access_study_groups']
        })
      }
    ];

    // Insert roles
    for (const role of roles) {
      await connection.execute(`
        INSERT IGNORE INTO user_roles (id, name, description, permissions, is_active, created_at, updated_at) 
        VALUES (?, ?, ?, ?, true, NOW(3), NOW(3))
      `, [role.id, role.name, role.description, role.permissions]);
    }

    // Verify insertion
    const [rows] = await connection.execute('SELECT name, description FROM user_roles ORDER BY name');
    console.log('✅ Security roles created:');
    rows.forEach(role => {
      console.log(`  - ${role.name}: ${role.description}`);
    });

    // Create sample categories
    console.log('\n📚 Creating sample categories...');
    const categories = [
      { name: 'Electronics', slug: 'electronics', description: 'Laptops, phones, tablets and other electronics' },
      { name: 'Textbooks', slug: 'textbooks', description: 'Academic textbooks for all subjects' },
      { name: 'Notes', slug: 'notes', description: 'Study notes and course materials' },
      { name: 'Tutoring', slug: 'tutoring', description: 'Tutoring services and study help' }
    ];

    for (const category of categories) {
      await connection.execute(`
        INSERT IGNORE INTO categories (id, name, slug, description, createdAt, updatedAt) 
        VALUES (?, ?, ?, ?, NOW(3), NOW(3))
      `, [`cat_${category.slug}`, category.name, category.slug, category.description]);
    }

    console.log('✅ Sample categories created');
    console.log('\n🎯 Security system is ready!');
    console.log('📝 Next steps:');
    console.log('  1. Update your authentication system to use MySQL');
    console.log('  2. Test user registration and login');
    console.log('  3. Deploy to Azure when ready');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

setupSecurity();