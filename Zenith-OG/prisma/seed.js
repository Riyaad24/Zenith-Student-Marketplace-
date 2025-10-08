const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleUsers = [
  {
    id: 'user1',
    email: 'john@university.ac.za',
    name: 'John Smith',
    phone: '+27123456789',
    university: 'University of Cape Town',
    location: 'Cape Town'
  },
  {
    id: 'user2', 
    email: 'sarah@wits.ac.za',
    name: 'Sarah Johnson',
    phone: '+27987654321',
    university: 'University of the Witwatersrand',
    location: 'Johannesburg'
  },
  {
    id: 'user3',
    email: 'mike@up.ac.za', 
    name: 'Mike Williams',
    phone: '+27555123456',
    university: 'University of Pretoria',
    location: 'Pretoria'
  }
]

const sampleCategories = [
  { id: 'cat1', name: 'Textbooks', slug: 'textbooks', description: 'Academic textbooks for all subjects' },
  { id: 'cat2', name: 'Electronics', slug: 'electronics', description: 'Laptops, phones, tablets and tech accessories' },
  { id: 'cat3', name: 'Study Notes', slug: 'notes', description: 'Student notes and study materials' },
  { id: 'cat4', name: 'Tutoring', slug: 'tutoring', description: 'Tutoring services and academic help' }
]

const sampleProducts = [
  {
    id: 'prod1',
    title: 'MacBook Air M2 - Almost New',
    description: 'Barely used MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Perfect for students. Includes original charger and box.',
    price: 18000,
    condition: 'Like New',
    image: '/images/electronics-laptop.png',
    location: 'Cape Town',
    university: 'University of Cape Town',
    categoryId: 'cat2',
    sellerId: 'user1',
    available: true
  },
  {
    id: 'prod2',
    title: 'Calculus Early Transcendentals 8th Edition',
    description: 'Essential calculus textbook by Stewart. Great condition with minimal highlighting. All pages intact.',
    price: 450,
    condition: 'Good',
    image: '/images/textbook-math.png',
    location: 'Johannesburg', 
    university: 'University of the Witwatersrand',
    categoryId: 'cat1',
    sellerId: 'user2',
    available: true
  },
  {
    id: 'prod3',
    title: 'iPhone 13 Pro - Excellent Condition',
    description: '256GB iPhone 13 Pro in Space Gray. Screen protector applied since day one. Battery health 95%.',
    price: 12500,
    condition: 'Excellent',
    image: '/images/electronics-phone.png',
    location: 'Pretoria',
    university: 'University of Pretoria', 
    categoryId: 'cat2',
    sellerId: 'user3',
    available: true
  },
  {
    id: 'prod4',
    title: 'Organic Chemistry Notes - First Year',
    description: 'Comprehensive first-year organic chemistry notes. Color-coded and well organized. Helped me get an A+!',
    price: 150,
    condition: 'Good',
    image: '/images/notes-chemistry.png',
    location: 'Cape Town',
    university: 'University of Cape Town',
    categoryId: 'cat3', 
    sellerId: 'user1',
    available: true
  },
  {
    id: 'prod5',
    title: 'Samsung Galaxy Tab S8 + S Pen',
    description: '11-inch tablet perfect for note-taking and studying. Includes official S Pen and keyboard case.',
    price: 8500,
    condition: 'Like New',
    image: '/images/electronics-tablet.png',
    location: 'Johannesburg',
    university: 'University of the Witwatersrand',
    categoryId: 'cat2',
    sellerId: 'user2', 
    available: true
  },
  {
    id: 'prod6',
    title: 'Introduction to Psychology Textbook',
    description: 'Psychology 101 textbook by Myers. 12th Edition. Some highlighting but very readable.',
    price: 380,
    condition: 'Fair',
    image: '/images/textbook-psychology.png',
    location: 'Pretoria',
    university: 'University of Pretoria',
    categoryId: 'cat1',
    sellerId: 'user3',
    available: true
  },
  {
    id: 'prod7',
    title: 'Mathematics Tutoring - All Levels',
    description: 'Experienced maths tutor offering help with calculus, linear algebra, statistics. R200/hour.',
    price: 200,
    condition: 'New',
    image: '/images/tutoring-math.png',
    location: 'Cape Town',
    university: 'University of Cape Town',
    categoryId: 'cat4',
    sellerId: 'user1',
    available: true
  },
  {
    id: 'prod8',
    title: 'Business Management Study Guide',
    description: 'Complete study guide for Business Management 101. Includes past papers and memo solutions.',
    price: 180,
    condition: 'Good',
    image: '/images/notes-business.png',
    location: 'Johannesburg',
    university: 'University of the Witwatersrand', 
    categoryId: 'cat3',
    sellerId: 'user2',
    available: true
  },
  {
    id: 'prod9',
    title: 'Engineering Mechanics Textbook',
    description: 'Statics and Dynamics by Russell Hibbeler. 14th Edition. Essential for engineering students.',
    price: 520,
    condition: 'Good',
    image: '/images/textbook-engineering.png',
    location: 'Pretoria',
    university: 'University of Pretoria',
    categoryId: 'cat1',
    sellerId: 'user3',
    available: true
  },
  {
    id: 'prod10',
    title: 'HP Pavilion Laptop - Student Special',
    description: 'Reliable HP laptop with Intel i5, 8GB RAM, 512GB SSD. Great for assignments and research.',
    price: 9500,
    condition: 'Good',
    image: '/images/electronics-laptop.png',
    location: 'Cape Town',
    university: 'University of Cape Town',
    categoryId: 'cat2',
    sellerId: 'user1',
    available: true
  }
]

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  console.log('👥 Creating users...')
  for (const user of sampleUsers) {
    await prisma.user.create({
      data: user
    })
  }

  // Create categories
  console.log('📂 Creating categories...')
  for (const category of sampleCategories) {
    await prisma.category.create({
      data: category
    })
  }

  // Create products
  console.log('📦 Creating products...')
  for (const product of sampleProducts) {
    await prisma.product.create({
      data: product
    })
  }

  console.log('✅ Database seeding completed!')
  console.log(`Created ${sampleUsers.length} users`)
  console.log(`Created ${sampleCategories.length} categories`)
  console.log(`Created ${sampleProducts.length} products`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })