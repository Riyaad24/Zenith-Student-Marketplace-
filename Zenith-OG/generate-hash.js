const bcrypt = require('bcrypt');

async function generateHash() {
  try {
    const password = 'StudentPass123!';
    const hash = await bcrypt.hash(password, 12);
    console.log('Password:', password);
    console.log('Hash:', hash);
    
    // Also test if the hash works
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash validation:', isValid);
  } catch (error) {
    console.error('Error:', error);
  }
}

generateHash();