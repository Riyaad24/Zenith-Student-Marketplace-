const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function executeSqlScript() {
  const connection = await mysql.createConnection('mysql://root:Riyaad24*@localhost:3306/zenith_marketplace');
  
  try {
    console.log('📋 Loading security setup script...');
    const sqlScript = fs.readFileSync(path.join(__dirname, 'scripts', '04-prisma-security-tables.sql'), 'utf8');
    
    // Split by delimiter and execute each statement
    const statements = sqlScript.split('DELIMITER //')[0].split(';').filter(stmt => stmt.trim() && !stmt.trim().startsWith('--'));
    
    console.log('🔐 Executing security setup...');
    for (const statement of statements) {
      const trimmedStmt = statement.trim();
      if (trimmedStmt && !trimmedStmt.startsWith('--') && !trimmedStmt.includes('DELIMITER')) {
        await connection.execute(trimmedStmt);
      }
    }
    
    console.log('✅ Security setup completed successfully!');
    
    // Verify roles were created
    const [rows] = await connection.execute('SELECT name, description FROM user_roles ORDER BY name');
    console.log('🎯 Created user roles:');
    rows.forEach(role => {
      console.log(`  - ${role.name}: ${role.description}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

executeSqlScript();