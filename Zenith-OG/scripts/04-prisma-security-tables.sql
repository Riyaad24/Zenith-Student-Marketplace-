-- ========================================
-- Prisma Security Tables for MySQL
-- Execute this in MySQL Workbench after creating the basic tables
-- ========================================

USE zenith_marketplace;

-- Create User Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    name VARCHAR(191) NOT NULL UNIQUE,
    description TEXT,
    permissions JSON NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);

-- Create User Role Assignments Table
CREATE TABLE IF NOT EXISTS user_role_assignments (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    user_id VARCHAR(191) NOT NULL,
    role_id VARCHAR(191) NOT NULL,
    assigned_by VARCHAR(191),
    assigned_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    expires_at DATETIME(3),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE KEY unique_user_role (user_id, role_id),
    INDEX idx_user_role_assignments_user_id (user_id),
    INDEX idx_user_role_assignments_role_id (role_id),
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE CASCADE
);

-- Create Account Security Table
CREATE TABLE IF NOT EXISTS account_security (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    user_id VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(191) NOT NULL,
    salt VARCHAR(191) NOT NULL,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_secret VARCHAR(191),
    backup_codes JSON,
    password_reset_token VARCHAR(191),
    password_reset_expires DATETIME(3),
    email_verification_token VARCHAR(191),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified_at DATETIME(3),
    account_locked BOOLEAN NOT NULL DEFAULT FALSE,
    locked_until DATETIME(3),
    failed_login_attempts INT NOT NULL DEFAULT 0,
    last_login DATETIME(3),
    last_password_change DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    INDEX idx_account_security_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    user_id VARCHAR(191) NOT NULL,
    session_token VARCHAR(191) NOT NULL UNIQUE,
    ip_address VARCHAR(191),
    user_agent TEXT,
    expires_at DATETIME(3) NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    last_accessed DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    INDEX idx_user_sessions_user_id (user_id),
    INDEX idx_user_sessions_session_token (session_token),
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create Security Audit Log Table
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    user_id VARCHAR(191),
    action VARCHAR(191) NOT NULL,
    resource_type VARCHAR(191),
    resource_id VARCHAR(191),
    ip_address VARCHAR(191),
    user_agent TEXT,
    details JSON,
    risk_level VARCHAR(191) NOT NULL DEFAULT 'LOW',
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_security_audit_logs_user_id (user_id),
    INDEX idx_security_audit_logs_action (action),
    INDEX idx_security_audit_logs_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Create Login Attempts Table
CREATE TABLE IF NOT EXISTS login_attempts (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    email VARCHAR(191) NOT NULL,
    ip_address VARCHAR(191) NOT NULL,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(191),
    attempted_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_login_attempts_email (email),
    INDEX idx_login_attempts_ip_address (ip_address),
    INDEX idx_login_attempts_attempted_at (attempted_at)
);

-- Create Data Access Log Table
CREATE TABLE IF NOT EXISTS data_access_logs (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    user_id VARCHAR(191),
    table_name VARCHAR(191) NOT NULL,
    record_id VARCHAR(191),
    operation VARCHAR(191) NOT NULL,
    old_values JSON,
    new_values JSON,
    accessed_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_data_access_logs_user_id (user_id),
    INDEX idx_data_access_logs_table_name (table_name),
    INDEX idx_data_access_logs_accessed_at (accessed_at),
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Insert Default User Roles
INSERT IGNORE INTO user_roles (id, name, description, permissions) VALUES
('clr1_super_admin', 'super_admin', 'Full system access with all privileges', 
 JSON_OBJECT(
    'users', JSON_ARRAY('create', 'read', 'update', 'delete', 'manage_roles'),
    'products', JSON_ARRAY('create', 'read', 'update', 'delete', 'moderate'),
    'orders', JSON_ARRAY('create', 'read', 'update', 'delete', 'refund'),
    'categories', JSON_ARRAY('create', 'read', 'update', 'delete'),
    'system', JSON_ARRAY('backup', 'restore', 'configure', 'monitor'),
    'security', JSON_ARRAY('view_logs', 'manage_permissions', 'system_admin')
 )),
('clr2_admin', 'admin', 'Administrative access for platform management', 
 JSON_OBJECT(
    'users', JSON_ARRAY('create', 'read', 'update', 'suspend'),
    'products', JSON_ARRAY('read', 'update', 'moderate', 'feature'),
    'orders', JSON_ARRAY('read', 'update', 'process', 'refund'),
    'categories', JSON_ARRAY('create', 'read', 'update'),
    'reports', JSON_ARRAY('view', 'export'),
    'security', JSON_ARRAY('view_logs')
 )),
('clr3_moderator', 'moderator', 'Content moderation and user management', 
 JSON_OBJECT(
    'users', JSON_ARRAY('read', 'moderate', 'warn'),
    'products', JSON_ARRAY('read', 'moderate', 'approve', 'reject'),
    'orders', JSON_ARRAY('read', 'view_disputes'),
    'reports', JSON_ARRAY('view', 'moderate')
 )),
('clr4_seller', 'seller', 'Seller privileges for product and order management', 
 JSON_OBJECT(
    'products', JSON_ARRAY('create', 'read', 'update', 'delete_own'),
    'orders', JSON_ARRAY('read_own', 'update_own', 'fulfill'),
    'analytics', JSON_ARRAY('view_own'),
    'messages', JSON_ARRAY('send', 'receive')
 )),
('clr5_buyer', 'buyer', 'Standard buyer privileges', 
 JSON_OBJECT(
    'products', JSON_ARRAY('read', 'search', 'review'),
    'orders', JSON_ARRAY('create', 'read_own', 'cancel_own'),
    'cart', JSON_ARRAY('manage'),
    'messages', JSON_ARRAY('send', 'receive')
 )),
('clr6_student', 'student', 'Enhanced student privileges with special features', 
 JSON_OBJECT(
    'products', JSON_ARRAY('read', 'search', 'review', 'create_textbook_listings'),
    'orders', JSON_ARRAY('create', 'read_own', 'cancel_own'),
    'cart', JSON_ARRAY('manage'),
    'messages', JSON_ARRAY('send', 'receive'),
    'student_features', JSON_ARRAY('access_student_discounts', 'access_study_groups')
 ));

-- Create triggers for audit logging
DELIMITER //

-- Trigger for profiles table changes
CREATE TRIGGER profiles_audit_trigger
    AFTER UPDATE ON profiles
    FOR EACH ROW
BEGIN
    INSERT INTO data_access_logs (id, user_id, table_name, record_id, operation, old_values, new_values, accessed_at)
    VALUES (
        CONCAT('dal_', UUID()),
        NEW.id,
        'profiles',
        NEW.id,
        'UPDATE',
        JSON_OBJECT('email', OLD.email, 'first_name', OLD.first_name, 'last_name', OLD.last_name),
        JSON_OBJECT('email', NEW.email, 'first_name', NEW.first_name, 'last_name', NEW.last_name),
        NOW(3)
    );
END//

-- Cleanup old audit logs (keep 90 days)
CREATE EVENT IF NOT EXISTS cleanup_old_audit_logs
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    DELETE FROM security_audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
    DELETE FROM login_attempts WHERE attempted_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
    DELETE FROM data_access_logs WHERE accessed_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
END//

DELIMITER ;

-- Enable event scheduler (run this if events are not working)
-- SET GLOBAL event_scheduler = ON;

SELECT 'Security tables and roles created successfully!' AS Status;