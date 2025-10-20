-- ======================================
-- ZENITH MARKETPLACE DATABASE SETUP
-- ======================================

-- Use the zenith_marketplace database
USE zenith_marketplace;

-- Drop existing tables if they exist (in correct order to avoid foreign key conflicts)
DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `data_access_logs`;
DROP TABLE IF EXISTS `login_attempts`;
DROP TABLE IF EXISTS `security_audit_logs`;
DROP TABLE IF EXISTS `user_sessions`;
DROP TABLE IF EXISTS `account_security`;
DROP TABLE IF EXISTS `user_role_assignments`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `profiles`;

-- ======================================
-- CREATE TABLES
-- ======================================

-- 1. Create profiles table (User model)
CREATE TABLE `profiles` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `avatar_url` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `university` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `bio` TEXT NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `profiles_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Create categories table
CREATE TABLE `categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Create products table
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DOUBLE NOT NULL,
    `image` VARCHAR(191) NULL,
    `images` TEXT NULL,
    `condition` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `available` BOOLEAN NOT NULL DEFAULT true,
    `location` VARCHAR(191) NULL,
    `university` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `categoryId` VARCHAR(191) NOT NULL,
    `sellerId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (`sellerId`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. Create addresses table
CREATE TABLE `addresses` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NULL,
    `address1` VARCHAR(191) NOT NULL,
    `address2` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'South Africa',
    `phone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 5. Create orders table
CREATE TABLE `orders` (
    `id` VARCHAR(191) NOT NULL,
    `total` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `shippingCost` DOUBLE NOT NULL DEFAULT 0,
    `tax` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `addressId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (`addressId`) REFERENCES `addresses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6. Create cart_items table
CREATE TABLE `cart_items` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `cart_items_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 7. Create order_items table
CREATE TABLE `order_items` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 8. Create reviews table
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `reviews_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 9. Create messages table
CREATE TABLE `messages` (
    `id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `senderId` VARCHAR(191) NOT NULL,
    `receiverId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`senderId`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (`receiverId`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ======================================
-- SECURITY TABLES (Optional)
-- ======================================

-- 10. Create user_roles table
CREATE TABLE `user_roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `permissions` JSON NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ======================================
-- SEED DATA
-- ======================================

-- Insert sample categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`) VALUES
('cat_textbooks', 'Textbooks', 'textbooks', 'New and used textbooks for all courses'),
('cat_electronics', 'Electronics', 'electronics', 'Laptops, calculators, and other devices'),
('cat_tutoring', 'Tutoring', 'tutoring', 'Find tutors or offer your services'),
('cat_notes', 'Study Notes', 'notes', 'Share and buy study materials');

-- Insert sample user
INSERT INTO `profiles` (`id`, `email`, `first_name`, `last_name`, `university`, `verified`) VALUES
('user_sample', 'student@uct.ac.za', 'John', 'Doe', 'University of Cape Town', true);

-- Insert sample products
INSERT INTO `products` (`id`, `title`, `description`, `price`, `condition`, `categoryId`, `sellerId`, `location`, `university`) VALUES
('prod_1', 'Financial Accounting Textbook', 'ACC1001 textbook in excellent condition', 250.00, 'used', 'cat_textbooks', 'user_sample', 'Cape Town', 'University of Cape Town'),
('prod_2', 'Scientific Calculator', 'Casio FX-991ES Plus calculator', 180.00, 'like new', 'cat_electronics', 'user_sample', 'Cape Town', 'University of Cape Town');

-- ======================================
-- VERIFY SETUP
-- ======================================

-- Show all tables
SHOW TABLES;

-- Show table structures
DESCRIBE profiles;
DESCRIBE products;
DESCRIBE categories;