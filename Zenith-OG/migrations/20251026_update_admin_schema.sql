-- Migration: Update admins table with student_number and email fields
-- Created: 2025-10-26

-- Add new columns to admins table
ALTER TABLE `admins` 
ADD COLUMN `student_number` VARCHAR(9) NULL AFTER `user_id`,
ADD COLUMN `email` VARCHAR(255) NULL AFTER `student_number`;

-- Add indexes for performance
CREATE INDEX `admins_student_number_idx` ON `admins`(`student_number`);
CREATE INDEX `admins_email_idx` ON `admins`(`email`);

-- Update existing admin records to populate student_number and email from users table
UPDATE `admins` a
JOIN `profiles` u ON a.user_id = u.id
SET 
  a.student_number = CASE 
    WHEN u.email REGEXP '^[0-9]{9}ads@my\\.richfield\\.ac\\.za$' 
    THEN SUBSTRING(u.email, 1, 9)
    ELSE NULL
  END,
  a.email = LOWER(u.email)
WHERE u.email IS NOT NULL;