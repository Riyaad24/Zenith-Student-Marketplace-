-- Sample data for Zenith Student Marketplace

-- Insert User Roles
INSERT INTO user_roles (id, name, description, permissions, is_active, updated_at) VALUES
('role_1', 'Student', 'Regular student user', '{"can_buy": true, "can_sell": true, "can_message": true}', TRUE, NOW()),
('role_2', 'Moderator', 'Platform moderator', '{"can_buy": true, "can_sell": true, "can_message": true, "can_moderate": true}', TRUE, NOW()),
('role_3', 'Admin', 'Platform administrator', '{"can_buy": true, "can_sell": true, "can_message": true, "can_moderate": true, "can_admin": true}', TRUE, NOW());

-- Insert Categories
INSERT INTO categories (id, name, slug, description, image, updatedAt) VALUES
('cat_1', 'Textbooks', 'textbooks', 'Academic textbooks for all subjects', '/images/textbooks.jpg', NOW()),
('cat_2', 'Electronics', 'electronics', 'Laptops, phones, tablets, and accessories', '/images/electronics.jpg', NOW()),
('cat_3', 'Furniture', 'furniture', 'Dorm room and apartment furniture', '/images/furniture.jpg', NOW()),
('cat_4', 'Clothing', 'clothing', 'Fashion and university branded apparel', '/images/clothing.jpg', NOW()),
('cat_5', 'Sports & Recreation', 'sports-recreation', 'Sports equipment and recreational items', '/images/sports.jpg', NOW()),
('cat_6', 'Study Supplies', 'study-supplies', 'Notebooks, pens, calculators, and study aids', '/images/supplies.jpg', NOW());

-- Insert Sample Users
INSERT INTO profiles (id, email, first_name, last_name, university, location, bio, verified, updated_at) VALUES
('user_1', 'john.smith@uct.ac.za', 'John', 'Smith', 'University of Cape Town', 'Cape Town', 'Computer Science student looking for great deals on textbooks and electronics.', TRUE, NOW()),
('user_2', 'sarah.jones@wits.ac.za', 'Sarah', 'Jones', 'University of the Witwatersrand', 'Johannesburg', 'Business student selling furniture before graduation.', TRUE, NOW()),
('user_3', 'mike.brown@uct.ac.za', 'Mike', 'Brown', 'University of Cape Town', 'Cape Town', 'Engineering student with various electronics for sale.', TRUE, NOW());

-- Insert Account Security (password: StudentPass123! for all test users)
INSERT INTO account_security (id, user_id, password_hash, salt, email_verified, updated_at) VALUES
('sec_1', 'user_1', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeT4fDAzRKqLFLSei', 'salt1', TRUE, NOW()),
('sec_2', 'user_2', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeT4fDAzRKqLFLSei', 'salt2', TRUE, NOW()),
('sec_3', 'user_3', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeT4fDAzRKqLFLSei', 'salt3', TRUE, NOW());

-- Assign User Roles
INSERT INTO user_role_assignments (id, user_id, role_id, updated_at) VALUES
('assign_1', 'user_1', 'role_1', NOW()),
('assign_2', 'user_2', 'role_1', NOW()),
('assign_3', 'user_3', 'role_1', NOW());

-- Insert Sample Products
INSERT INTO products (id, title, description, price, image, `condition`, status, location, university, categoryId, sellerId, updated_at) VALUES
('prod_1', 'Computer Science Textbook - Data Structures', 'Excellent condition textbook for CSC2001F. Minimal highlighting, all pages intact.', 450.00, '/images/products/textbook1.jpg', 'used', 'active', 'Cape Town', 'University of Cape Town', 'cat_1', 'user_1', NOW()),
('prod_2', 'MacBook Air M1 13"', 'Gently used MacBook Air, perfect for students. Includes charger and sleeve.', 12500.00, '/images/products/macbook.jpg', 'used', 'active', 'Johannesburg', 'University of the Witwatersrand', 'cat_2', 'user_2', NOW()),
('prod_3', 'iPhone 13 128GB', 'Excellent condition iPhone 13. Screen protector and case included.', 8500.00, '/images/products/iphone.jpg', 'used', 'active', 'Cape Town', 'University of Cape Town', 'cat_2', 'user_3', NOW());