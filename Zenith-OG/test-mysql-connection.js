const mysql = require('mysql2/promise');

console.log('🔍 Testing MySQL Connection...');

async function testConnection() {
  const connectionStrings = [
    'mysql://root:Riyaad24*@localhost:3306/zenith_marketplace', // Your password
    'mysql://root:@localhost:3306/zenith_marketplace',      // No password
    'mysql://root:root@localhost:3306/zenith_marketplace',  // Password: root
  ];

  for (const connectionString of connectionStrings) {
    try {
      console.log(`Testing: ${connectionString.replace(/:([^@]+)@/, ':***@')}`);
      const connection = await mysql.createConnection(connectionString);
      await connection.execute('SELECT 1');
      console.log('✅ Connection successful!');
      console.log('Use this in your .env file:');
      console.log(`DATABASE_URL="${connectionString}"`);
      await connection.end();
      return;
    } catch (error) {
      console.log('❌ Failed:', error.message);
    }
  }
  
  console.log('\n🔧 Manual setup required:');
  console.log('1. Open MySQL Workbench');
  console.log('2. Check your connection settings');
  console.log('3. Update .env with correct credentials');
}

testConnection().catch(console.error);