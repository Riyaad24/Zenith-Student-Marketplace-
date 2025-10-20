-- MySQL Seed Data for Zenith Student Marketplace

-- Insert categories
INSERT INTO categories (name, slug, description, icon) VALUES
('Textbooks', 'textbooks', 'New and used textbooks for all courses', 'book'),
('Electronics', 'electronics', 'Laptops, calculators, and other devices', 'laptop'),
('Notes & Study Guides', 'notes', 'Class notes, study guides, and past papers', 'file-text'),
('Tutoring', 'tutoring', 'Find tutors or offer your services', 'users');

-- Insert sample user profiles (for testing purposes)
INSERT INTO profiles (id, email, first_name, last_name, university, location, verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john.smith@uct.ac.za', 'John', 'Smith', 'University of Cape Town', 'Cape Town', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'sarah.jones@wits.ac.za', 'Sarah', 'Jones', 'University of the Witwatersrand', 'Johannesburg', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 'mike.brown@up.ac.za', 'Mike', 'Brown', 'University of Pretoria', 'Pretoria', TRUE);

-- Insert sample products
INSERT INTO products (seller_id, category_id, title, description, price, condition, course_code, institution, subject, faculty, images, preview_images) VALUES
-- Financial Accounting Notes
('550e8400-e29b-41d4-a716-446655440001', 
 (SELECT id FROM categories WHERE slug = 'notes'), 
 'Financial Accounting Complete Notes', 
 'Comprehensive notes covering all chapters of Financial Accounting for first-year students. Includes examples, practice questions, and exam tips.', 
 150.00, 
 'like_new', 
 'ACC1001', 
 'University of Cape Town', 
 'Financial Accounting', 
 'Commerce', 
 JSON_ARRAY('/images/notes-business.png'),
 JSON_ARRAY('/images/preview1.jpg', '/images/preview2.jpg')),

-- Psychology Textbook
('550e8400-e29b-41d4-a716-446655440002', 
 (SELECT id FROM categories WHERE slug = 'textbooks'), 
 'Introduction to Psychology Textbook', 
 'Latest edition psychology textbook in excellent condition. No highlighting or damage.', 
 450.00, 
 'good', 
 'PSY1001', 
 'University of the Witwatersrand', 
 'Psychology', 
 'Humanities', 
 JSON_ARRAY('/images/category-textbooks.png'),
 JSON_ARRAY()),

-- Scientific Calculator
('550e8400-e29b-41d4-a716-446655440003', 
 (SELECT id FROM categories WHERE slug = 'electronics'), 
 'Scientific Calculator Casio FX-991', 
 'Advanced scientific calculator perfect for engineering students. Includes original manual and case.', 
 250.00, 
 'like_new', 
 'ENG1001', 
 'University of Pretoria', 
 'Mathematics', 
 'Engineering', 
 JSON_ARRAY('/images/electronics-tablet.png'),
 JSON_ARRAY()),

-- Engineering Textbook
('550e8400-e29b-41d4-a716-446655440003', 
 (SELECT id FROM categories WHERE slug = 'textbooks'), 
 'Engineering Mathematics Textbook', 
 'Essential mathematics textbook for first-year engineering students. Good condition with minimal wear.', 
 380.00, 
 'good', 
 'MAT1001', 
 'University of Pretoria', 
 'Mathematics', 
 'Engineering', 
 JSON_ARRAY('/images/category-textbooks.png'),
 JSON_ARRAY()),

-- Study Notes
('550e8400-e29b-41d4-a716-446655440002', 
 (SELECT id FROM categories WHERE slug = 'notes'), 
 'Business Management Summary Notes', 
 'Concise summary notes for Business Management module covering all key concepts and theories.', 
 120.00, 
 'new', 
 'BUS1001', 
 'University of the Witwatersrand', 
 'Business Management', 
 'Commerce', 
 JSON_ARRAY('/images/notes-business.png'),
 JSON_ARRAY('/images/preview-bus1.jpg'));
