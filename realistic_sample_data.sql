-- =============================================
-- ZENITH STUDENT MARKETPLACE - Realistic Sample Data
-- This script creates realistic users with authentication data
-- and products with images for testing the marketplace
-- =============================================

USE zenith_marketplace;

-- Clear existing data (in correct order to avoid FK constraints)
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM reviews;
DELETE FROM messages;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM data_access_logs;
DELETE FROM security_audit_logs;
DELETE FROM user_sessions;
DELETE FROM user_role_assignments;
DELETE FROM account_security;
DELETE FROM profiles;
DELETE FROM user_roles;
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- USER ROLES
-- =============================================
INSERT INTO user_roles (id, name, description, permissions, is_active) VALUES
('role_001', 'student', 'Regular student user', '["read", "create_listing", "purchase", "message"]', TRUE),
('role_002', 'admin', 'Administrator with full access', '["read", "write", "delete", "admin", "moderate"]', TRUE),
('role_003', 'moderator', 'Content moderator', '["read", "moderate", "suspend_user", "remove_listing"]', TRUE);

-- =============================================
-- CATEGORIES
-- =============================================
INSERT INTO categories (id, name, slug, description, image) VALUES
('cat_001', 'Textbooks', 'textbooks', 'New and used textbooks for all academic subjects', '/images/categories/textbooks.jpg'),
('cat_002', 'Electronics', 'electronics', 'Laptops, calculators, tablets, and electronic devices', '/images/categories/electronics.jpg'),
('cat_003', 'Notes & Study Guides', 'notes', 'Class notes, study guides, past papers, and summaries', '/images/categories/notes.jpg'),
('cat_004', 'Tutoring Services', 'tutoring', 'Find tutors or offer tutoring services', '/images/categories/tutoring.jpg'),
('cat_005', 'Stationery', 'stationery', 'Pens, notebooks, highlighters, and office supplies', '/images/categories/stationery.jpg'),
('cat_006', 'Furniture', 'furniture', 'Desks, chairs, bookcases, and dorm furniture', '/images/categories/furniture.jpg');

-- =============================================
-- REALISTIC USER PROFILES
-- =============================================
INSERT INTO profiles (id, email, first_name, last_name, avatar_url, phone, university, location, bio, verified, created_at, updated_at) VALUES
-- Student Users
('user_001', 'john.smith@uct.ac.za', 'John', 'Smith', '/images/avatars/john_smith.jpg', '+27 82 123 4567', 'University of Cape Town', 'Cape Town', 'BCom student specializing in Finance. Selling textbooks and offering tutoring in Accounting.', TRUE, '2024-09-15 08:30:00', '2024-10-20 14:22:00'),

('user_002', 'sarah.jones@wits.ac.za', 'Sarah', 'Jones', '/images/avatars/sarah_jones.jpg', '+27 83 987 6543', 'University of the Witwatersrand', 'Johannesburg', 'Psychology major with a passion for helping fellow students. I have notes from 2nd and 3rd year courses.', TRUE, '2024-08-22 10:15:00', '2024-10-19 16:45:00'),

('user_003', 'mike.brown@up.ac.za', 'Mike', 'Brown', '/images/avatars/mike_brown.jpg', '+27 84 555 7890', 'University of Pretoria', 'Pretoria', 'Engineering student. Selling scientific calculator and engineering textbooks. Also available for Math tutoring.', TRUE, '2024-07-10 14:20:00', '2024-10-20 09:30:00'),

('user_004', 'emma.wilson@sun.ac.za', 'Emma', 'Wilson', '/images/avatars/emma_wilson.jpg', '+27 72 246 8135', 'Stellenbosch University', 'Stellenbosch', 'Medical student selling anatomy textbooks and offering Biology tutoring. Afrikaans and English.', TRUE, '2024-06-05 11:45:00', '2024-10-18 13:20:00'),

('user_005', 'david.lee@ufs.ac.za', 'David', 'Lee', '/images/avatars/david_lee.jpg', '+27 76 369 2580', 'University of the Free State', 'Bloemfontein', 'Computer Science student. Have programming books and a gaming laptop for sale.', TRUE, '2024-09-01 16:00:00', '2024-10-20 11:15:00'),

('user_006', 'lisa.clark@ru.ac.za', 'Lisa', 'Clark', '/images/avatars/lisa_clark.jpg', '+27 78 147 9630', 'Rhodes University', 'Grahamstown', 'English Literature student. Selling novels, poetry books, and offering English tutoring.', TRUE, '2024-08-18 09:30:00', '2024-10-19 15:50:00'),

('user_007', 'james.taylor@nwu.ac.za', 'James', 'Taylor', '/images/avatars/james_taylor.jpg', '+27 81 852 9630', 'North-West University', 'Potchefstroom', 'Business Administration student. Have business textbooks and a study desk for sale.', TRUE, '2024-07-25 12:00:00', '2024-10-20 10:40:00'),

('user_008', 'anna.martin@uj.ac.za', 'Anna', 'Martin', '/images/avatars/anna_martin.jpg', '+27 79 753 8520', 'University of Johannesburg', 'Johannesburg', 'Art student selling art supplies and offering design tutoring. Love helping creative minds!', TRUE, '2024-09-10 14:45:00', '2024-10-19 17:25:00');

-- =============================================
-- ACCOUNT SECURITY (Hashed passwords)
-- =============================================
-- NOTE: These are bcrypt hashes for password "StudentPass123!" for testing
INSERT INTO account_security (id, user_id, password_hash, salt, two_factor_enabled, email_verified, account_locked, failed_login_attempts, last_login, created_at, updated_at) VALUES
('sec_001', 'user_001', '$2a$12$LQv3c1yqBwEHFPw44JOOKUOYWpFxmPUMYz5IJ4zYqPJ5BvfZ9QfOy', 'salt_001', FALSE, TRUE, FALSE, 0, '2024-10-20 08:15:00', '2024-09-15 08:30:00', '2024-10-20 08:15:00'),
('sec_002', 'user_002', '$2a$12$LQv3c1yqBwEHFPw44JOOKUOYWpFxmPUMYz5IJ4zYqPJ5BvfZ9QfOy', 'salt_002', FALSE, TRUE, FALSE, 0, '2024-10-19 20:30:00', '2024-08-22 10:15:00', '2024-10-19 20:30:00'),
('sec_003', 'user_003', '$2a$12$LQv3c1yqBwEHFPw44JOOKUOYWpFxmPUMYz5IJ4zYqPJ5BvfZ9QfOy', 'salt_003', FALSE, TRUE, FALSE, 0, '2024-10-20 07:45:00', '2024-07-10 14:20:00', '2024-10-20 07:45:00'),
('sec_004', 'user_004', '$2a$12$LQv3c1yqBwEHFPw44JOOKUOYWpFxmPUMYz5IJ4zYqPJ5BvfZ9QfOy', 'salt_004', FALSE, TRUE, FALSE, 0, '2024-10-18 19:10:00', '2024-06-05 11:45:00', '2024-10-18 19:10:00'),
('sec_005', 'user_005', '$2a$12$LQv3c1yqBwEHFPw44JOOKUOYWpFxmPUMYz5IJ4zYqPJ5BvfZ9QfOy', 'salt_005', FALSE, TRUE, FALSE, 0, '2024-10-20 09:20:00', '2024-09-01 16:00:00', '2024-10-20 09:20:00'),
('sec_006', 'user_006', '$2a$12$LQv3c1yqBwEHFPw44JOOKUOYWpFxmPUMYz5IJ4zYqPJ5BvfZ9QfOy', 'salt_006', FALSE, TRUE, FALSE, 0, '2024-10-19 18:30:00', '2024-08-18 09:30:00', '2024-10-19 18:30:00'),
('sec_007', 'user_007', '$2a$12$LQv3c1yqBwEHFPw44JOOKUOYWpFxmPUMYz5IJ4zYqPJ5BvfZ9QfOy', 'salt_007', FALSE, TRUE, FALSE, 0, '2024-10-20 06:50:00', '2024-07-25 12:00:00', '2024-10-20 06:50:00'),
('sec_008', 'user_008', '$2a$12$LQv3c1yqBwEHFPw44JOOKUOYWpFxmPUMYz5IJ4zYqPJ5BvfZ9QfOy', 'salt_008', FALSE, TRUE, FALSE, 0, '2024-10-19 21:15:00', '2024-09-10 14:45:00', '2024-10-19 21:15:00');

-- =============================================
-- USER ROLE ASSIGNMENTS
-- =============================================
INSERT INTO user_role_assignments (id, user_id, role_id, assigned_at, is_active) VALUES
('assign_001', 'user_001', 'role_001', '2024-09-15 08:30:00', TRUE),
('assign_002', 'user_002', 'role_001', '2024-08-22 10:15:00', TRUE),
('assign_003', 'user_003', 'role_001', '2024-07-10 14:20:00', TRUE),
('assign_004', 'user_004', 'role_001', '2024-06-05 11:45:00', TRUE),
('assign_005', 'user_005', 'role_001', '2024-09-01 16:00:00', TRUE),
('assign_006', 'user_006', 'role_001', '2024-08-18 09:30:00', TRUE),
('assign_007', 'user_007', 'role_001', '2024-07-25 12:00:00', TRUE),
('assign_008', 'user_008', 'role_001', '2024-09-10 14:45:00', TRUE);

-- =============================================
-- REALISTIC PRODUCTS WITH IMAGES
-- =============================================
INSERT INTO products (id, title, description, price, image, images, `condition`, status, available, location, university, categoryId, sellerId, created_at, updated_at) VALUES

-- Textbooks
('prod_001', 'Financial Accounting 8th Edition - Weygandt', 'Comprehensive financial accounting textbook in excellent condition. Used for ACC1001 at UCT. No highlighting, all pages intact. Perfect for first-year commerce students.', 450.00, '/images/products/financial_accounting_main.jpg', '["\/images\/products\/financial_accounting_main.jpg", "\/images\/products\/financial_accounting_back.jpg", "\/images\/products\/financial_accounting_inside.jpg"]', 'good', 'active', TRUE, 'Cape Town', 'University of Cape Town', 'cat_001', 'user_001', '2024-10-15 10:30:00', '2024-10-15 10:30:00'),

('prod_002', 'Psychology: The Science of Mind 7th Edition', 'Latest edition psychology textbook by Passer & Smith. Used for PSY1001 at Wits. Minimal highlighting, excellent condition. Includes access code (unused).', 520.00, '/images/products/psychology_textbook_main.jpg', '["\/images\/products\/psychology_textbook_main.jpg", "\/images\/products\/psychology_textbook_spine.jpg", "\/images\/products\/psychology_textbook_contents.jpg"]', 'like_new', 'active', TRUE, 'Johannesburg', 'University of the Witwatersrand', 'cat_001', 'user_002', '2024-10-12 14:15:00', '2024-10-12 14:15:00'),

('prod_003', 'Engineering Mathematics 4th Edition - Stroud', 'Essential math textbook for engineering students. Used for ENG1001 at UP. Good condition with some highlighting in key chapters. Great for first-year engineering.', 380.00, '/images/products/engineering_math_main.jpg', '["\/images\/products\/engineering_math_main.jpg", "\/images\/products\/engineering_math_back.jpg"]', 'good', 'active', TRUE, 'Pretoria', 'University of Pretoria', 'cat_001', 'user_003', '2024-10-10 09:45:00', '2024-10-10 09:45:00'),

('prod_004', 'Grays Anatomy for Students 4th Edition', 'Complete anatomy textbook with detailed illustrations. Perfect for medical students. Excellent condition, barely used. Includes online access codes.', 750.00, '/images/products/grays_anatomy_main.jpg', '["\/images\/products\/grays_anatomy_main.jpg", "\/images\/products\/grays_anatomy_inside1.jpg", "\/images\/products\/grays_anatomy_inside2.jpg", "\/images\/products\/grays_anatomy_spine.jpg"]', 'like_new', 'active', TRUE, 'Stellenbosch', 'Stellenbosch University', 'cat_001', 'user_004', '2024-10-08 16:20:00', '2024-10-08 16:20:00'),

-- Electronics
('prod_005', 'Casio FX-991ES Plus Scientific Calculator', 'Advanced scientific calculator perfect for engineering and science students. Includes original box, manual, and protective case. Barely used, like new condition.', 180.00, '/images/products/casio_calculator_main.jpg', '["\/images\/products\/casio_calculator_main.jpg", "\/images\/products\/casio_calculator_box.jpg", "\/images\/products\/casio_calculator_manual.jpg"]', 'like_new', 'active', TRUE, 'Pretoria', 'University of Pretoria', 'cat_002', 'user_003', '2024-10-14 11:30:00', '2024-10-14 11:30:00'),

('prod_006', 'Dell Inspiron 15 Gaming Laptop', 'Perfect for CS students! Intel i5, 8GB RAM, GTX 1650, 512GB SSD. Great for programming, gaming, and general use. Excellent condition, barely 1 year old. Includes charger and laptop bag.', 8500.00, '/images/products/dell_laptop_main.jpg', '["\/images\/products\/dell_laptop_main.jpg", "\/images\/products\/dell_laptop_keyboard.jpg", "\/images\/products\/dell_laptop_ports.jpg", "\/images\/products\/dell_laptop_specs.jpg"]', 'like_new', 'active', TRUE, 'Bloemfontein', 'University of the Free State', 'cat_002', 'user_005', '2024-10-13 13:45:00', '2024-10-13 13:45:00'),

('prod_007', 'iPad Air 4th Generation 64GB WiFi', 'Perfect for note-taking and digital studying. Includes Apple Pencil (1st gen) and keyboard case. Excellent condition, screen protector applied since day 1. Great for any student!', 4200.00, '/images/products/ipad_air_main.jpg', '["\/images\/products\/ipad_air_main.jpg", "\/images\/products\/ipad_air_pencil.jpg", "\/images\/products\/ipad_air_keyboard.jpg", "\/images\/products\/ipad_air_accessories.jpg"]', 'good', 'active', TRUE, 'Johannesburg', 'University of Johannesburg', 'cat_002', 'user_008', '2024-10-11 15:20:00', '2024-10-11 15:20:00'),

-- Notes & Study Guides
('prod_008', 'Complete Financial Accounting Notes - 1st Year', 'Comprehensive handwritten notes for Financial Accounting 1A and 1B. Includes all lecture notes, tutorial solutions, and exam preparation summaries. Helped me get 85% in the course!', 120.00, '/images/products/accounting_notes_main.jpg', '["\/images\/products\/accounting_notes_main.jpg", "\/images\/products\/accounting_notes_sample1.jpg", "\/images\/products\/accounting_notes_sample2.jpg"]', 'new', 'active', TRUE, 'Cape Town', 'University of Cape Town', 'cat_003', 'user_001', '2024-10-16 08:15:00', '2024-10-16 08:15:00'),

('prod_009', 'Psychology Research Methods Study Guide', 'Detailed study guide covering research methodology, statistics, and experimental design. Includes practice questions and exam tips. Perfect for 2nd year psych students.', 85.00, '/images/products/psych_study_guide_main.jpg', '["\/images\/products\/psych_study_guide_main.jpg", "\/images\/products\/psych_study_guide_inside.jpg"]', 'new', 'active', TRUE, 'Johannesburg', 'University of the Witwatersrand', 'cat_003', 'user_002', '2024-10-17 12:30:00', '2024-10-17 12:30:00'),

('prod_010', 'Engineering Mathematics Formula Sheets', 'Complete set of formula sheets for Calculus, Linear Algebra, and Differential Equations. Laminated for durability. Allowed in exams at most universities.', 45.00, '/images/products/math_formulas_main.jpg', '["\/images\/products\/math_formulas_main.jpg", "\/images\/products\/math_formulas_sample.jpg"]', 'new', 'active', TRUE, 'Pretoria', 'University of Pretoria', 'cat_003', 'user_003', '2024-10-18 14:50:00', '2024-10-18 14:50:00'),

-- Furniture
('prod_011', 'IKEA Study Desk with Drawers', 'White study desk in great condition. Perfect for dorm or apartment. Includes 3 drawers for storage. Easy to assemble, instructions included. Must collect in Grahamstown.', 650.00, '/images/products/study_desk_main.jpg', '["\/images\/products\/study_desk_main.jpg", "\/images\/products\/study_desk_drawers.jpg", "\/images\/products\/study_desk_side.jpg"]', 'good', 'active', TRUE, 'Grahamstown', 'Rhodes University', 'cat_006', 'user_006', '2024-10-09 16:40:00', '2024-10-09 16:40:00'),

('prod_012', 'Ergonomic Office Chair', 'Comfortable office chair perfect for long study sessions. Adjustable height and back support. Black mesh design, excellent condition. Collection only in Potchefstroom.', 450.00, '/images/products/office_chair_main.jpg', '["\/images\/products\/office_chair_main.jpg", "\/images\/products\/office_chair_side.jpg"]', 'good', 'active', TRUE, 'Potchefstroom', 'North-West University', 'cat_006', 'user_007', '2024-10-07 10:25:00', '2024-10-07 10:25:00');

-- =============================================
-- SAMPLE CART ITEMS
-- =============================================
INSERT INTO cart_items (id, quantity, userId, productId, created_at, updated_at) VALUES
('cart_001', 1, 'user_002', 'prod_001', '2024-10-19 14:30:00', '2024-10-19 14:30:00'),
('cart_002', 1, 'user_003', 'prod_002', '2024-10-18 16:45:00', '2024-10-18 16:45:00'),
('cart_003', 1, 'user_004', 'prod_005', '2024-10-17 11:20:00', '2024-10-17 11:20:00');

-- =============================================
-- SAMPLE ORDERS (Completed purchases)
-- =============================================
INSERT INTO orders (id, total, status, userId, created_at, updated_at) VALUES
('order_001', 380.00, 'completed', 'user_004', '2024-10-05 14:20:00', '2024-10-06 09:15:00'),
('order_002', 85.00, 'completed', 'user_005', '2024-10-12 16:30:00', '2024-10-13 10:45:00'),
('order_003', 650.00, 'pending', 'user_001', '2024-10-19 18:45:00', '2024-10-19 18:45:00');

INSERT INTO order_items (id, quantity, price, orderId, productId) VALUES
('item_001', 1, 380.00, 'order_001', 'prod_003'),
('item_002', 1, 85.00, 'order_002', 'prod_009'),
('item_003', 1, 650.00, 'order_003', 'prod_011');

-- =============================================
-- SAMPLE REVIEWS
-- =============================================
INSERT INTO reviews (id, rating, comment, userId, productId, created_at, updated_at) VALUES
('review_001', 5, 'Excellent condition as described! Fast delivery and great communication from seller. Highly recommend!', 'user_004', 'prod_003', '2024-10-07 10:30:00', '2024-10-07 10:30:00'),
('review_002', 4, 'Good quality notes, helped me prepare for my exam. Would buy from this seller again.', 'user_005', 'prod_009', '2024-10-14 15:20:00', '2024-10-14 15:20:00'),
('review_003', 5, 'Amazing textbook! Like new condition and saved me so much money compared to the bookstore.', 'user_006', 'prod_001', '2024-10-16 12:45:00', '2024-10-16 12:45:00');

-- =============================================
-- SAMPLE MESSAGES
-- =============================================
INSERT INTO messages (id, content, senderId, receiverId, productId, created_at, updated_at) VALUES
('msg_001', 'Hi! Is this textbook still available? Can I collect it tomorrow?', 'user_002', 'user_001', 'prod_001', '2024-10-19 13:15:00', '2024-10-19 13:15:00'),
('msg_002', 'Yes, it is still available! What time works for you?', 'user_001', 'user_002', 'prod_001', '2024-10-19 13:45:00', '2024-10-19 13:45:00'),
('msg_003', 'Is the laptop still under warranty? Any issues with it?', 'user_008', 'user_005', 'prod_006', '2024-10-18 16:20:00', '2024-10-18 16:20:00'),
('msg_004', 'Yes, still has 8 months warranty left. No issues at all, runs perfectly!', 'user_005', 'user_008', 'prod_006', '2024-10-18 17:30:00', '2024-10-18 17:30:00');

-- =============================================
-- SAMPLE USER SESSIONS (for login tracking)
-- =============================================
INSERT INTO user_sessions (id, user_id, session_token, ip_address, user_agent, expires_at, created_at, last_accessed, is_active) VALUES
('session_001', 'user_001', 'sess_tok_001_' || UNIX_TIMESTAMP(), '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2024-10-21 08:15:00', '2024-10-20 08:15:00', '2024-10-20 08:15:00', TRUE),
('session_002', 'user_002', 'sess_tok_002_' || UNIX_TIMESTAMP(), '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2024-10-20 20:30:00', '2024-10-19 20:30:00', '2024-10-19 20:30:00', TRUE),
('session_003', 'user_003', 'sess_tok_003_' || UNIX_TIMESTAMP(), '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '2024-10-21 07:45:00', '2024-10-20 07:45:00', '2024-10-20 07:45:00', TRUE);

-- =============================================
-- SUMMARY OF CREATED DATA
-- =============================================
-- Users: 8 realistic student profiles with proper authentication
-- Categories: 6 marketplace categories
-- Products: 12 detailed products with multiple images
-- Security: Password hashes, sessions, and role assignments
-- Transactions: Sample orders, cart items, and reviews
-- Communication: Sample messages between users
--
-- All users can login with email and password: "StudentPass123!"
-- All data includes realistic South African universities and locations
-- Product images are referenced but you'll need to add actual image files
-- =============================================

SELECT 'Database populated with realistic sample data!' as Status;