import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('Testing database connection...')
    
    // Find our test user
    const user = await prisma.user.findUnique({
      where: { email: 'john.smith@uct.ac.za' },
      include: {
        security: true
      }
    })
    
    console.log('Found test user:', user ? 'YES' : 'NO')
    if (user && user.security) {
      console.log('User ID:', user.id)
      console.log('User email:', user.email)
      console.log('Password hash:', user.security.passwordHash)
      
      // Test password verification
      const testPassword = 'StudentPass123!'
      console.log('Testing password:', testPassword)
      
      const isValid = await bcrypt.compare(testPassword, user.security.passwordHash)
      console.log('Password match:', isValid ? 'YES' : 'NO')
      
      // If it doesn't match, let's create a new hash
      if (!isValid) {
        console.log('Creating new hash for password...')
        const newHash = await bcrypt.hash(testPassword, 12)
        console.log('New hash:', newHash)
        
        // Test the new hash
        const newHashValid = await bcrypt.compare(testPassword, newHash)
        console.log('New hash valid:', newHashValid ? 'YES' : 'NO')
      }
    }
    
  } catch (error) {
    console.error('Database test error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()