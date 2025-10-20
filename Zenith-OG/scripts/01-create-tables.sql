-- MySQL Database Schema for Zenith Student Marketplace
-- Note: Row Level Security is not available in MySQL - implement in application layer

-- Create database (run separately if needed)
-- CREATE DATABASE zenith_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE zenith_marketplace;

-- Create users table (profiles)
CREATE TABLE profiles (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  university VARCHAR(255),
  location VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(500),
  phone VARCHAR(50),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  seller_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  condition ENUM('new', 'like_new', 'good', 'fair', 'poor') NOT NULL,
  status ENUM('active', 'sold', 'draft', 'inactive') DEFAULT 'active',
  images JSON,
  course_code VARCHAR(100),
  institution VARCHAR(255),
  year_level VARCHAR(50),
  subject VARCHAR(255),
  faculty VARCHAR(255),
  file_format VARCHAR(50),
  page_count INT,
  preview_images JSON,
  tags JSON,
  views INT DEFAULT 0,
  favorites INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Create favorites table
CREATE TABLE favorites (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_product (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create cart table
CREATE TABLE cart_items (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_cart_item (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create orders table
CREATE TABLE orders (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  buyer_id VARCHAR(36) NOT NULL,
  seller_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'paid', 'completed', 'cancelled', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(100),
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create messages table
CREATE TABLE messages (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  sender_id VARCHAR(36) NOT NULL,
  receiver_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create reviews table
CREATE TABLE reviews (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  reviewer_id VARCHAR(36) NOT NULL,
  reviewee_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36),
  order_id VARCHAR(36),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reviewer_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewee_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Create tutoring_requests table
CREATE TABLE tutoring_requests (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  student_id VARCHAR(36) NOT NULL,
  tutor_id VARCHAR(36),
  subject VARCHAR(255) NOT NULL,
  level VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  location_preference VARCHAR(255),
  delivery_method ENUM('online', 'in_person', 'both') NOT NULL,
  status ENUM('open', 'matched', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (tutor_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_tutoring_requests_student_id ON tutoring_requests(student_id);
CREATE INDEX idx_tutoring_requests_status ON tutoring_requests(status);

-- Note: MySQL does not support Row Level Security (RLS) like PostgreSQL
-- Security policies must be implemented at the application level
-- Consider using views with WHERE clauses for data access control
-- Example security implementations should be added to your API layer

-- Optional: Create views for common queries with security checks
-- These would need to be implemented with proper user context in your application

CREATE VIEW active_products AS
SELECT * FROM products WHERE status = 'active';

-- Add any additional MySQL-specific optimizations as needed
