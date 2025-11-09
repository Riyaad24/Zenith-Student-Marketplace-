const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function restoreData() {
  try {
    console.log('🔄 Starting database restoration...')
    
    // Read SQL file
    const sqlFile = path.join(__dirname, '..', 'simple_data.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')
    
    // Split by statements (basic splitting by semicolon)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      // Skip empty statements
      if (!statement.trim()) continue
      
      try {
        await prisma.$executeRawUnsafe(statement)
        successCount++
        if (i % 10 === 0) {
          console.log(`✅ Executed ${i + 1}/${statements.length} statements...`)
        }
      } catch (error) {
        errorCount++
        // Log only critical errors
        if (!error.message.includes('Duplicate entry') && !error.message.includes('already exists')) {
          console.error(`❌ Error in statement ${i + 1}:`, error.message.substring(0, 100))
        }
      }
    }
    
    console.log('\n✅ Database restoration completed!')
    console.log(`   Success: ${successCount} statements`)
    console.log(`   Skipped/Errors: ${errorCount} statements`)
    
    // Verify data
    const userCount = await prisma.user.count()
    const productCount = await prisma.product.count()
    const categoryCount = await prisma.category.count()
    
    console.log('\n📊 Database summary:')
    console.log(`   Users: ${userCount}`)
    console.log(`   Products: ${productCount}`)
    console.log(`   Categories: ${categoryCount}`)
    
  } catch (error) {
    console.error('❌ Restoration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

restoreData()
