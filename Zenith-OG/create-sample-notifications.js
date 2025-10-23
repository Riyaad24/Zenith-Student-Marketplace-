import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createSampleNotifications() {
  try {
    // First, get a user to create notifications for
    const user = await prisma.user.findFirst()
    
    if (!user) {
      console.log('No users found. Please create a user first.')
      return
    }

    console.log(`Creating sample notifications for user: ${user.email}`)

    // Create sample notifications
    const notifications = [
      {
        type: 'verification',
        title: 'Account Verification Complete',
        message: 'Congratulations! Your student verification has been approved. You can now access all premium features.',
        userId: user.id,
        metadata: {
          verificationLevel: 'student'
        }
      },
      {
        type: 'system',
        title: 'Welcome to Zenith Student Marketplace',
        message: 'Welcome to our platform! Start browsing textbooks, electronics, and study materials from fellow students.',
        userId: user.id,
        metadata: {
          welcomeMessage: true
        }
      },
      {
        type: 'product_review',
        title: 'New Review on Your Product',
        message: 'Someone left a 5-star review on your "Advanced Chemistry Textbook". Check it out!',
        userId: user.id,
        metadata: {
          productId: 'sample-product-1',
          rating: 5
        }
      },
      {
        type: 'order_status',
        title: 'Order Shipped',
        message: 'Your order #ZM2024001 has been shipped and is on its way. Expected delivery: 2-3 business days.',
        userId: user.id,
        metadata: {
          orderId: 'ZM2024001',
          status: 'shipped'
        }
      },
      {
        type: 'message',
        title: 'New Message from Sarah',
        message: 'You have a new message about the Scientific Calculator. Click to view and respond.',
        userId: user.id,
        metadata: {
          senderId: 'sample-sender-1',
          senderName: 'Sarah'
        }
      }
    ]

    // Create all notifications
    for (const notification of notifications) {
      await prisma.notification.create({
        data: notification
      })
      console.log(`Created notification: ${notification.title}`)
    }

    console.log('Sample notifications created successfully!')

  } catch (error) {
    console.error('Error creating sample notifications:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleNotifications()