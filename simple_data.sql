-- Simple sample data for Zenith Student Marketplace

-- Insert User Roles (skip updated_at for now)
INSERT INTO user_roles (id, name, description, permissions, is_active) VALUES
('role_1', 'Student', 'Regular student user', '{"can_buy": true, "can_sell": true, "can_message": true}', TRUE);

-- Insert Categories (skip updatedAt for now)
INSERT INTO categories (id, name, slug, description, image) VALUES
('cat_1', 'Textbooks', 'textbooks', 'Academic textbooks for all subjects', '/images/textbooks.jpg'),
('cat_2', 'Electronics', 'electronics', 'Laptops, phones, tablets, and accessories', '/images/electronics.jpg');

-- Insert Sample Users (skip updated_at for now)
INSERT INTO profiles (id, email, first_name, last_name, university, location, bio, verified) VALUES
('user_1', 'john.smith@uct.ac.za', 'John', 'Smith', 'University of Cape Town', 'Cape Town', 'Computer Science student', TRUE),
('user_2', 'sarah.jones@wits.ac.za', 'Sarah', 'Jones', 'University of the Witwatersrand', 'Johannesburg', 'Business student', TRUE);

-- Insert Account Security (password: StudentPass123! for all test users)
INSERT INTO account_security (id, user_id, password_hash, salt, email_verified) VALUES
('sec_1', 'user_1', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeT4fDAzRKqLFLSei', 'salt1', TRUE),
('sec_2', 'user_2', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeT4fDAzRKqLFLSei', 'salt2', TRUE);

-- Assign User Roles (skip updated_at for now)
INSERT INTO user_role_assignments (id, user_id, role_id) VALUES
('assign_1', 'user_1', 'role_1'),
('assign_2', 'user_2', 'role_1');

-- Insert Sample Products (skip updated_at for now)  
INSERT INTO products (id, title, description, price, image, `condition`, status, location, university, categoryId, sellerId) VALUES
('prod_1', 'Computer Science Textbook', 'Data Structures textbook in excellent condition', 450.00, '/images/textbook1.jpg', 'used', 'active', 'Cape Town', 'University of Cape Town', 'cat_1', 'user_1'),
('prod_2', 'MacBook Air M1', 'Gently used MacBook Air with charger', 12500.00, '/images/macbook.jpg', 'used', 'active', 'Johannesburg', 'University of the Witwatersrand', 'cat_2', 'user_2');