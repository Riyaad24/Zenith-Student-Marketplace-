-- =============================================
-- ZENITH STUDENT MARKETPLACE - MySQL Database Setup
-- Generated: October 20, 2025
-- Based on current Prisma schema
-- =============================================

-- Create database
CREATE DATABASE IF NOT EXISTS zenith_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zenith_marketplace;

-- =============================================
-- TABLE CREATION
-- =============================================

-- User Roles Table
CREATE TABLE user_roles (
    id VARCHAR(191) PRIMARY KEY,
    name VARCHAR(191) UNIQUE NOT NULL,
    description TEXT,
    permissions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users/Profiles Table
CREATE TABLE profiles (
    id VARCHAR(191) PRIMARY KEY,
    email VARCHAR(191) UNIQUE NOT NULL,
    first_name VARCHAR(191),
    last_name VARCHAR(191),
    avatar_url VARCHAR(500),
    phone VARCHAR(191),
    university VARCHAR(191),
    location VARCHAR(191),
    bio TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Account Security Table
CREATE TABLE account_security (
    id VARCHAR(191) PRIMARY KEY,
    user_id VARCHAR(191) UNIQUE NOT NULL,
    password_hash VARCHAR(191) NOT NULL,
    salt VARCHAR(191) NOT NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(191),
    backup_codes JSON,
    password_reset_token VARCHAR(191),
    password_reset_expires TIMESTAMP NULL,
    email_verification_token VARCHAR(191),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    account_locked BOOLEAN DEFAULT FALSE,
    locked_until TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0,
    last_login TIMESTAMP NULL,
    last_password_change TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- User Role Assignments Table
CREATE TABLE user_role_assignments (
    id VARCHAR(191) PRIMARY KEY,
    user_id VARCHAR(191) NOT NULL,
    role_id VARCHAR(191) NOT NULL,
    assigned_by VARCHAR(191),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_user_role (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE CASCADE
);

-- User Sessions Table
CREATE TABLE user_sessions (
    id VARCHAR(191) PRIMARY KEY,
    user_id VARCHAR(191) NOT NULL,
    session_token VARCHAR(191) UNIQUE NOT NULL,
    ip_address VARCHAR(191),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Security Audit Log Table
CREATE TABLE security_audit_logs (
    id VARCHAR(191) PRIMARY KEY,
    user_id VARCHAR(191),
    action VARCHAR(191) NOT NULL,
    resource_type VARCHAR(191),
    resource_id VARCHAR(191),
    ip_address VARCHAR(191),
    user_agent TEXT,
    details JSON,
    risk_level VARCHAR(191) DEFAULT 'LOW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Login Attempts Table
CREATE TABLE login_attempts (
    id VARCHAR(191) PRIMARY KEY,
    email VARCHAR(191) NOT NULL,
    ip_address VARCHAR(191) NOT NULL,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(191),
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data Access Log Table
CREATE TABLE data_access_logs (
    id VARCHAR(191) PRIMARY KEY,
    user_id VARCHAR(191),
    table_name VARCHAR(191) NOT NULL,
    record_id VARCHAR(191),
    operation VARCHAR(191) NOT NULL,
    old_values JSON,
    new_values JSON,
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Categories Table
CREATE TABLE categories (
    id VARCHAR(191) PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    slug VARCHAR(191) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id VARCHAR(191) PRIMARY KEY,
    title VARCHAR(191) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500),
    images TEXT, -- JSON array of image URLs
    `condition` VARCHAR(191) NOT NULL, -- new, used, refurbished
    status VARCHAR(191) DEFAULT 'active', -- active, sold, inactive
    available BOOLEAN DEFAULT TRUE,
    location VARCHAR(191), -- City or area for local pickup
    university VARCHAR(191), -- Associated university/college
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    categoryId VARCHAR(191) NOT NULL,
    sellerId VARCHAR(191) NOT NULL,
    FOREIGN KEY (categoryId) REFERENCES categories(id),
    FOREIGN KEY (sellerId) REFERENCES profiles(id)
);

-- Cart Items Table
CREATE TABLE cart_items (
    id VARCHAR(191) PRIMARY KEY,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    userId VARCHAR(191) NOT NULL,
    productId VARCHAR(191) NOT NULL,
    UNIQUE KEY unique_user_product (userId, productId),
    FOREIGN KEY (userId) REFERENCES profiles(id),
    FOREIGN KEY (productId) REFERENCES products(id)
);

-- Addresses Table
CREATE TABLE addresses (
    id VARCHAR(191) PRIMARY KEY,
    type VARCHAR(191) NOT NULL, -- shipping, billing
    firstName VARCHAR(191) NOT NULL,
    lastName VARCHAR(191) NOT NULL,
    company VARCHAR(191),
    address1 VARCHAR(191) NOT NULL,
    address2 VARCHAR(191),
    city VARCHAR(191) NOT NULL,
    state VARCHAR(191) NOT NULL,
    postalCode VARCHAR(191) NOT NULL,
    country VARCHAR(191) DEFAULT 'South Africa',
    phone VARCHAR(191),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    userId VARCHAR(191) NOT NULL,
    FOREIGN KEY (userId) REFERENCES profiles(id)
);

-- Orders Table
CREATE TABLE orders (
    id VARCHAR(191) PRIMARY KEY,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(191) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
    shippingCost DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    userId VARCHAR(191) NOT NULL,
    addressId VARCHAR(191),
    FOREIGN KEY (userId) REFERENCES profiles(id),
    FOREIGN KEY (addressId) REFERENCES addresses(id)
);

-- Order Items Table
CREATE TABLE order_items (
    id VARCHAR(191) PRIMARY KEY,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    orderId VARCHAR(191) NOT NULL,
    productId VARCHAR(191) NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(id),
    FOREIGN KEY (productId) REFERENCES products(id)
);

-- Reviews Table
CREATE TABLE reviews (
    id VARCHAR(191) PRIMARY KEY,
    rating INT NOT NULL, -- 1-5 stars
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    userId VARCHAR(191) NOT NULL,
    productId VARCHAR(191) NOT NULL,
    UNIQUE KEY unique_user_product_review (userId, productId),
    FOREIGN KEY (userId) REFERENCES profiles(id),
    FOREIGN KEY (productId) REFERENCES products(id)
);

-- Messages Table
CREATE TABLE messages (
    id VARCHAR(191) PRIMARY KEY,
    content TEXT NOT NULL,
    `read` BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    senderId VARCHAR(191) NOT NULL,
    receiverId VARCHAR(191) NOT NULL,
    FOREIGN KEY (senderId) REFERENCES profiles(id),
    FOREIGN KEY (receiverId) REFERENCES profiles(id)
);

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert User Roles
INSERT INTO user_roles (id, name, description, permissions, is_active) VALUES
('role_1', 'Student', 'Regular student user', '{"can_buy": true, "can_sell": true, "can_message": true}', TRUE),
('role_2', 'Moderator', 'Platform moderator', '{"can_buy": true, "can_sell": true, "can_message": true, "can_moderate": true}', TRUE),
('role_3', 'Admin', 'Platform administrator', '{"can_buy": true, "can_sell": true, "can_message": true, "can_moderate": true, "can_admin": true}', TRUE);

-- Insert Categories
INSERT INTO categories (id, name, slug, description, image) VALUES
('cat_1', 'Textbooks', 'textbooks', 'Academic textbooks for all subjects', '/images/textbooks.jpg'),
('cat_2', 'Electronics', 'electronics', 'Laptops, phones, tablets, and accessories', '/images/electronics.jpg'),
('cat_3', 'Furniture', 'furniture', 'Dorm room and apartment furniture', '/images/furniture.jpg'),
('cat_4', 'Clothing', 'clothing', 'Fashion and university branded apparel', '/images/clothing.jpg'),
('cat_5', 'Sports & Recreation', 'sports-recreation', 'Sports equipment and recreational items', '/images/sports.jpg'),
('cat_6', 'Study Supplies', 'study-supplies', 'Notebooks, pens, calculators, and study aids', '/images/supplies.jpg'),
('cat_7', 'Kitchen & Appliances', 'kitchen-appliances', 'Small kitchen appliances and cookware', '/images/kitchen.jpg'),
('cat_8', 'Transportation', 'transportation', 'Bikes, scooters, and car accessories', '/images/transport.jpg');

-- Insert Sample Users
INSERT INTO profiles (id, email, first_name, last_name, university, location, bio, verified) VALUES
('user_1', 'john.smith@student.ac.za', 'John', 'Smith', 'University of Cape Town', 'Cape Town', 'Computer Science student looking for great deals on textbooks and electronics.', TRUE),
('user_2', 'sarah.jones@wits.ac.za', 'Sarah', 'Jones', 'University of the Witwatersrand', 'Johannesburg', 'Business student selling furniture before graduation.', TRUE),
('user_3', 'mike.brown@uct.ac.za', 'Mike', 'Brown', 'University of Cape Town', 'Cape Town', 'Engineering student with various electronics for sale.', TRUE),
('user_4', 'emily.davis@sun.ac.za', 'Emily', 'Davis', 'Stellenbosch University', 'Stellenbosch', 'Psychology student looking for affordable textbooks.', TRUE),
('user_5', 'alex.wilson@ru.ac.za', 'Alex', 'Wilson', 'Rhodes University', 'Grahamstown', 'Art student selling creative supplies and equipment.', TRUE);

-- Insert Account Security (simplified passwords for demo)
INSERT INTO account_security (id, user_id, password_hash, salt, email_verified) VALUES
('sec_1', 'user_1', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeT4fDAzRKqLFLSei', 'salt1', TRUE),
('sec_2', 'user_2', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeT4fDAzRKqLFLSei', 'salt2', TRUE),
('sec_3', 'user_3', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeT4fDAzRKqLFLSei', 'salt3', TRUE),
('sec_4', 'user_4', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeT4fDAzRKqLFLSei', 'salt4', TRUE),
('sec_5', 'user_5', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeT4fDAzRKqLFLSei', 'salt5', TRUE);

-- Assign User Roles
INSERT INTO user_role_assignments (id, user_id, role_id) VALUES
('assign_1', 'user_1', 'role_1'),
('assign_2', 'user_2', 'role_1'),
('assign_3', 'user_3', 'role_1'),
('assign_4', 'user_4', 'role_1'),
('assign_5', 'user_5', 'role_2');

-- Insert Sample Products
INSERT INTO products (id, title, description, price, image, `condition`, status, location, university, categoryId, sellerId) VALUES
('prod_1', 'Computer Science Textbook - Data Structures', 'Excellent condition textbook for CSC2001F. Minimal highlighting, all pages intact.', 450.00, '/images/products/textbook1.jpg', 'used', 'active', 'Cape Town', 'University of Cape Town', 'cat_1', 'user_1'),
('prod_2', 'MacBook Air M1 13"', 'Gently used MacBook Air, perfect for students. Includes charger and sleeve.', 12500.00, '/images/products/macbook.jpg', 'used', 'active', 'Johannesburg', 'University of the Witwatersrand', 'cat_2', 'user_2'),
('prod_3', 'Study Desk with Drawers', 'Compact study desk perfect for dorm rooms. Good condition, minor scratches.', 800.00, '/images/products/desk.jpg', 'used', 'active', 'Cape Town', 'University of Cape Town', 'cat_3', 'user_3'),
('prod_4', 'iPhone 13 128GB', 'Excellent condition iPhone 13. Screen protector and case included.', 8500.00, '/images/products/iphone.jpg', 'used', 'active', 'Stellenbosch', 'Stellenbosch University', 'cat_2', 'user_4'),
('prod_5', 'Organic Chemistry Textbook', 'Brand new textbook for CHM2046. Never opened, still in wrapper.', 890.00, '/images/products/chem-book.jpg', 'new', 'active', 'Grahamstown', 'Rhodes University', 'cat_1', 'user_5'),
('prod_6', 'Gaming Chair', 'Comfortable ergonomic gaming chair. Great for long study sessions.', 1200.00, '/images/products/chair.jpg', 'used', 'active', 'Cape Town', 'University of Cape Town', 'cat_3', 'user_1'),
('prod_7', 'Scientific Calculator TI-84', 'Texas Instruments TI-84 Plus CE. Perfect for engineering and math courses.', 350.00, '/images/products/calculator.jpg', 'used', 'active', 'Johannesburg', 'University of the Witwatersrand', 'cat_6', 'user_2'),
('prod_8', 'University Hoodie - UCT', 'Official UCT hoodie, size M. Barely worn, excellent condition.', 250.00, '/images/products/hoodie.jpg', 'used', 'active', 'Cape Town', 'University of Cape Town', 'cat_4', 'user_3');

-- Insert Sample Addresses
INSERT INTO addresses (id, type, firstName, lastName, address1, city, state, postalCode, userId) VALUES
('addr_1', 'shipping', 'John', 'Smith', '123 University Ave', 'Cape Town', 'Western Cape', '7700', 'user_1'),
('addr_2', 'shipping', 'Sarah', 'Jones', '456 Campus Road', 'Johannesburg', 'Gauteng', '2000', 'user_2'),
('addr_3', 'shipping', 'Mike', 'Brown', '789 Student St', 'Cape Town', 'Western Cape', '7701', 'user_3'),
('addr_4', 'shipping', 'Emily', 'Davis', '321 College Lane', 'Stellenbosch', 'Western Cape', '7600', 'user_4'),
('addr_5', 'shipping', 'Alex', 'Wilson', '654 Rhodes Ave', 'Grahamstown', 'Eastern Cape', '6140', 'user_5');

-- Insert Sample Cart Items
INSERT INTO cart_items (id, quantity, userId, productId) VALUES
('cart_1', 1, 'user_2', 'prod_1'),
('cart_2', 1, 'user_3', 'prod_4'),
('cart_3', 2, 'user_1', 'prod_7');

-- Insert Sample Orders
INSERT INTO orders (id, total, status, userId, addressId) VALUES
('order_1', 450.00, 'delivered', 'user_2', 'addr_2'),
('order_2', 1200.00, 'confirmed', 'user_4', 'addr_4');

-- Insert Order Items
INSERT INTO order_items (id, quantity, price, orderId, productId) VALUES
('item_1', 1, 450.00, 'order_1', 'prod_1'),
('item_2', 1, 1200.00, 'order_2', 'prod_6');

-- Insert Sample Reviews
INSERT INTO reviews (id, rating, comment, userId, productId) VALUES
('review_1', 5, 'Great textbook in excellent condition. Fast delivery!', 'user_2', 'prod_1'),
('review_2', 4, 'Good chair, very comfortable for studying. Minor wear but as described.', 'user_4', 'prod_6');

-- Insert Sample Messages
INSERT INTO messages (id, content, senderId, receiverId) VALUES
('msg_1', 'Hi! Is the MacBook still available?', 'user_1', 'user_2'),
('msg_2', 'Yes, it is! Would you like to arrange a viewing?', 'user_2', 'user_1'),
('msg_3', 'Great! I''m interested in the iPhone. Can we meet on campus?', 'user_3', 'user_4'),
('msg_4', 'Sure! How about tomorrow at 2pm near the library?', 'user_4', 'user_3');

-- Insert Sample Security Audit Logs
INSERT INTO security_audit_logs (id, user_id, action, resource_type, resource_id, risk_level) VALUES
('audit_1', 'user_1', 'LOGIN', 'USER', 'user_1', 'LOW'),
('audit_2', 'user_2', 'PRODUCT_CREATE', 'PRODUCT', 'prod_2', 'LOW'),
('audit_3', 'user_3', 'ORDER_PLACE', 'ORDER', 'order_2', 'LOW');

-- Insert Sample Login Attempts
INSERT INTO login_attempts (id, email, ip_address, success) VALUES
('login_1', 'john.smith@student.ac.za', '192.168.1.100', TRUE),
('login_2', 'sarah.jones@wits.ac.za', '192.168.1.101', TRUE),
('login_3', 'invalid@email.com', '192.168.1.102', FALSE);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_products_category ON products(categoryId);
CREATE INDEX idx_products_seller ON products(sellerId);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_university ON products(university);
CREATE INDEX idx_orders_user ON orders(userId);
CREATE INDEX idx_messages_sender ON messages(senderId);
CREATE INDEX idx_messages_receiver ON messages(receiverId);
CREATE INDEX idx_reviews_product ON reviews(productId);
CREATE INDEX idx_security_logs_user ON security_audit_logs(user_id);
CREATE INDEX idx_security_logs_created ON security_audit_logs(created_at);

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

SELECT 'Zenith Student Marketplace database setup completed successfully!' as Status,
       (SELECT COUNT(*) FROM profiles) as Users,
       (SELECT COUNT(*) FROM products) as Products,
       (SELECT COUNT(*) FROM categories) as Categories,
       (SELECT COUNT(*) FROM orders) as Orders;