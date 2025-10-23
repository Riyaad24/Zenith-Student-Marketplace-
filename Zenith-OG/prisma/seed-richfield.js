const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleUsers = [
  { 
    id: 'user1', 
    email: '402302567@my.richfield.ac.za',
    firstName: 'John',
    lastName: 'Smith',
    phone: '+27123456789',
    university: 'Richfield Graduate Institute of Technology',
    location: 'Cape Town'
  },
  {
    id: 'user2', 
    email: '402304891@my.richfield.ac.za',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+27987654321',
    university: 'Richfield Graduate Institute of Technology',
    location: 'Johannesburg'
  },
  {
    id: 'user3',
    email: '402306123@my.richfield.ac.za', 
    firstName: 'Mike',
    lastName: 'Williams',
    phone: '+27555123456',
    university: 'Richfield Graduate Institute of Technology',
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
    title: 'Advanced Chemistry Textbook - 3rd Edition',
    description: 'Comprehensive chemistry textbook for university students. Excellent condition with minimal highlighting. Covers organic, inorganic, and physical chemistry with practice problems.',
    price: 650,
    condition: 'Good',
    image: '/images/textbook-chemistry.png',
    location: 'Cape Town',
    university: 'Richfield Graduate Institute of Technology',
    categoryId: 'cat1',
    sellerId: 'user1'
  },
  {
    id: 'prod2',
    title: 'MacBook Air M2 - Almost New',
    description: 'Barely used MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Perfect for students. Includes original charger and box.',
    price: 18000,
    condition: 'Like New',
    image: '/images/electronics-laptop.png',
    location: 'Cape Town',
    university: 'Richfield Graduate Institute of Technology',
    categoryId: 'cat2',
    sellerId: 'user1'
  },
  {
    id: 'prod3',
    title: 'Scientific Calculator HP 50g Graphing',
    description: 'Professional graphing calculator perfect for engineering and mathematics courses. Includes original manual, protective case, and USB cable.',
    price: 1200,
    condition: 'Excellent',
    image: '/images/calculator.png',
    location: 'Johannesburg',
    university: 'Richfield Graduate Institute of Technology',
    categoryId: 'cat2',
    sellerId: 'user2'
  },
  {
    id: 'prod4',
    title: 'Economics 101 Study Notes - Complete Set',
    description: 'Comprehensive study notes covering all major topics in introductory economics. Handwritten with clear diagrams, charts, and examples from lectures.',
    price: 150,
    condition: 'Good',
    image: '/images/notes-economics.png',
    location: 'Johannesburg',
    university: 'Richfield Graduate Institute of Technology',
    categoryId: 'cat3',
    sellerId: 'user2'
  },
  {
    id: 'prod5',
    title: 'Mathematics Tutoring - Calculus & Algebra',
    description: 'One-on-one mathematics tutoring for undergraduate students. Specializing in calculus, linear algebra, and statistics. Flexible scheduling available.',
    price: 300,
    condition: 'New',
    image: '/images/tutoring-math.png',
    location: 'Pretoria',
    university: 'Richfield Graduate Institute of Technology',
    categoryId: 'cat4',
    sellerId: 'user3'
  },
  {
    id: 'prod6',
    title: 'Physics Textbook - University Physics Volume 1',
    description: 'Standard physics textbook covering mechanics, waves, and thermodynamics. Good condition with some highlighting in key sections.',
    price: 580,
    condition: 'Good',
    image: '/images/textbook-physics.png',
    location: 'Cape Town',
    university: 'Richfield Graduate Institute of Technology',
    categoryId: 'cat1',
    sellerId: 'user1'
  },
  {
    id: 'prod7',
    title: 'Engineering Drawing Set - Complete Kit',
    description: 'Professional engineering drawing set with compass, rulers, protractors, and drawing pencils. Essential for engineering students.',
    price: 450,
    condition: 'Good',
    image: '/images/drawing-set.png',
    location: 'Johannesburg',
    university: 'Richfield Graduate Institute of Technology',
    categoryId: 'cat2',
    sellerId: 'user2'
  },
  {
    id: 'prod8',
    title: 'Business Studies Notes - 2nd Year Complete',
    description: 'Complete set of business studies notes for second-year students. Covers marketing, finance, management, and business law.',
    price: 200,
    condition: 'Excellent',
    image: '/images/notes-business.png',
    location: 'Pretoria',
    university: 'Richfield Graduate Institute of Technology',
    categoryId: 'cat3',
    sellerId: 'user3'
  },
  {
    id: 'prod9',
    title: 'iPad Pro with Apple Pencil - Perfect for Notes',
    description: 'iPad Pro 11-inch with Apple Pencil included. Great for digital note-taking and research. Includes keyboard case.',
    price: 12000,
    condition: 'Good',
    image: '/images/ipad-pro.png',
    location: 'Cape Town',
    university: 'Richfield Graduate Institute of Technology',
    categoryId: 'cat2',
    sellerId: 'user1'
  },
  {
    id: 'prod10',
    title: 'Statistics Textbook - Introduction to Statistical Thinking',
    description: 'Comprehensive statistics textbook with practical examples. Perfect for psychology, business, and science students.',
    price: 520,
    condition: 'Good',
    image: '/images/textbook-stats.png',
    location: 'Johannesburg',
    university: 'Richfield Graduate Institute of Technology',
    categoryId: 'cat1',
    sellerId: 'user2'
  },
  {
    id: 'prod11',
    title: 'Calculus Early Transcendentals 8th Edition',
    description: 'Essential calculus textbook by Stewart. Great condition with minimal highlighting. All pages intact.',
    price: 450,
    condition: 'Good',
    image: '/images/textbook-math.png',
    location: 'Johannesburg', 
    university: 'Richfield Graduate Institute of Technology',
    categoryId: 'cat1',
    sellerId: 'user2'
  },
  {
    id: 'prod12',
    title: 'iPhone 13 Pro - Excellent Condition',
    description: '256GB iPhone 13 Pro in Space Gray. Screen protector applied since day one. Battery health 95%.',
    price: 12500,
    condition: 'Excellent',
    image: '/images/electronics-phone.png',
    location: 'Pretoria',
    university: 'Richfield Graduate Institute of Technology', 
    categoryId: 'cat2',
    sellerId: 'user3'
  },
  {
    id: 'prod13',
    title: 'Organic Chemistry Notes - First Year',
    description: 'Comprehensive first-year organic chemistry notes. Color-coded and well organized. Helped me get an A+!',
    price: 150,
    condition: 'Good',
    image: '/images/notes-chemistry.png',
    location: 'Cape Town',
    university: 'Richfield Graduate Institute of Technology',
    categoryId: 'cat3', 
    sellerId: 'user1'
  },
  {
    id: 'prod14',
    title: 'Samsung Galaxy Tab S8 + S Pen',
    description: '11-inch tablet perfect for note-taking and studying. Includes official S Pen and keyboard case.',
    price: 8500,
    condition: 'Like New',
    image: '/images/electronics-tablet.png',
    location: 'Johannesburg',
    university: 'Richfield Graduate Institute of Technology',
    categoryId: 'cat2',
    sellerId: 'user2'
  },
  {
    id: 'prod15',
    title: 'Introduction to Psychology Textbook',
    description: 'Psychology 101 textbook by Myers. 12th Edition. Some highlighting but very readable.',
    price: 380,
    condition: 'Fair',
    image: '/images/textbook-psychology.png',
    location: 'Pretoria',
    university: 'Richfield Graduate Institute of Technology',
    categoryId: 'cat1',
    sellerId: 'user3'
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