import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updatePassword() {
  try {
    console.log('Updating password hash...')
    
    const newHash = '$2b$12$ZPLoApP5FuT3gqNNpMs15OX6OIQqU6AY1GLDjqpbSRWmQy6S0J.uC'
    
    const result = await prisma.accountSecurity.update({
      where: { userId: 'user_1' },
      data: {
        passwordHash: newHash
      }
    })
    
    console.log('Password updated successfully!')
    console.log('Updated record ID:', result.id)
    
  } catch (error) {
    console.error('Update error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePassword()