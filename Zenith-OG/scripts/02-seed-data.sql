-- Insert categories
INSERT INTO public.categories (name, slug, description, icon) VALUES
('Textbooks', 'textbooks', 'New and used textbooks for all courses', 'book'),
('Electronics', 'electronics', 'Laptops, calculators, and other devices', 'laptop'),
('Notes & Study Guides', 'notes', 'Class notes, study guides, and past papers', 'file-text'),
('Tutoring', 'tutoring', 'Find tutors or offer your services', 'users');

-- Insert sample products (these will be replaced with real user data)
INSERT INTO public.products (seller_id, category_id, title, description, price, condition, course_code, institution, subject, faculty, images, preview_images) VALUES
-- Note: seller_id will need to be updated with actual user IDs after users register
('00000000-0000-0000-0000-000000000000', (SELECT id FROM categories WHERE slug = 'notes'), 'Financial Accounting Complete Notes', 'Comprehensive notes covering all chapters of Financial Accounting for first-year students', 150.00, 'like_new', 'ACC1001', 'University of Cape Town', 'Financial Accounting', 'Commerce', ARRAY['/placeholder.svg?height=300&width=200&text=Accounting+Notes'], ARRAY['/placeholder.svg?height=400&width=300&text=Page+1', '/placeholder.svg?height=400&width=300&text=Page+2']),
('00000000-0000-0000-0000-000000000000', (SELECT id FROM categories WHERE slug = 'textbooks'), 'Introduction to Psychology Textbook', 'Latest edition psychology textbook in excellent condition', 450.00, 'good', 'PSY1001', 'University of the Witwatersrand', 'Psychology', 'Humanities', ARRAY['/placeholder.svg?height=300&width=200&text=Psychology+Book'], ARRAY[]),
('00000000-0000-0000-0000-000000000000', (SELECT id FROM categories WHERE slug = 'electronics'), 'Scientific Calculator Casio FX-991', 'Advanced scientific calculator perfect for engineering students', 250.00, 'like_new', 'ENG1001', 'University of Pretoria', 'Mathematics', 'Engineering', ARRAY['/placeholder.svg?height=300&width=200&text=Calculator'], ARRAY[]);
