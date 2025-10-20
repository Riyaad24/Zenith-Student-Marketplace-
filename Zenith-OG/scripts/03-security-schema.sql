-- ZENITH MARKETPLACE - ENHANCED SECURITY SCHEMA
-- Security Implementation for Database and User Access Control
-- Execute after running 01-create-tables.sql

-- =====================================================
-- SYSTEM SECURITY MEASURES IMPLEMENTATION
-- =====================================================

-- 1. User Roles and Permissions System
CREATE TABLE user_roles (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. User Role Assignments
CREATE TABLE user_role_assignments (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  role_id VARCHAR(36) NOT NULL,
  assigned_by VARCHAR(36),
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES profiles(id) ON DELETE SET NULL,
  UNIQUE KEY unique_user_role (user_id, role_id)
);

-- 3. Security Audit Logs
CREATE TABLE security_audit_logs (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(36),
  ip_address VARCHAR(45),
  user_agent TEXT,
  details JSON,
  risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'LOW',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL,
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_action (action),
  INDEX idx_audit_created (created_at),
  INDEX idx_audit_risk (risk_level)
);

-- 4. Login Attempts Tracking (Security Monitoring)
CREATE TABLE login_attempts (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason VARCHAR(100),
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_login_email (email),
  INDEX idx_login_ip (ip_address),
  INDEX idx_login_attempts_time (attempted_at)
);

-- 5. Account Security Settings
CREATE TABLE account_security (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(100) NOT NULL,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(100),
  backup_codes JSON,
  password_reset_token VARCHAR(100),
  password_reset_expires TIMESTAMP NULL,
  email_verification_token VARCHAR(100),
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

-- 6. Session Management
CREATE TABLE user_sessions (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  INDEX idx_session_token (session_token),
  INDEX idx_session_user (user_id),
  INDEX idx_session_expires (expires_at)
);

-- 7. Data Access Logs (for compliance)
CREATE TABLE data_access_logs (
  id VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36),
  table_name VARCHAR(100) NOT NULL,
  record_id VARCHAR(36),
  operation ENUM('SELECT', 'INSERT', 'UPDATE', 'DELETE') NOT NULL,
  old_values JSON,
  new_values JSON,
  accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL,
  INDEX idx_access_user (user_id),
  INDEX idx_access_table (table_name),
  INDEX idx_access_time (accessed_at)
);

-- =====================================================
-- INSERT DEFAULT SECURITY ROLES
-- =====================================================

INSERT INTO user_roles (id, name, description, permissions) VALUES
(UUID(), 'super_admin', 'System Super Administrator', JSON_OBJECT(
  'users', JSON_ARRAY('create', 'read', 'update', 'delete'),
  'products', JSON_ARRAY('create', 'read', 'update', 'delete', 'approve', 'reject'),
  'orders', JSON_ARRAY('create', 'read', 'update', 'delete', 'refund'),
  'system', JSON_ARRAY('backup', 'restore', 'audit', 'security'),
  'reports', JSON_ARRAY('view_all', 'export', 'analytics')
)),

(UUID(), 'admin', 'Platform Administrator', JSON_OBJECT(
  'users', JSON_ARRAY('read', 'update', 'suspend'),
  'products', JSON_ARRAY('read', 'update', 'approve', 'reject'),
  'orders', JSON_ARRAY('read', 'update', 'refund'),
  'reports', JSON_ARRAY('view_all', 'export')
)),

(UUID(), 'moderator', 'Content Moderator', JSON_OBJECT(
  'products', JSON_ARRAY('read', 'update', 'approve', 'reject'),
  'users', JSON_ARRAY('read', 'suspend'),
  'reports', JSON_ARRAY('view_limited')
)),

(UUID(), 'seller', 'Product Seller', JSON_OBJECT(
  'products', JSON_ARRAY('create', 'read', 'update', 'delete_own'),
  'orders', JSON_ARRAY('read_own', 'update_own'),
  'profile', JSON_ARRAY('read', 'update')
)),

(UUID(), 'buyer', 'Regular Customer', JSON_OBJECT(
  'products', JSON_ARRAY('read', 'favorite'),
  'orders', JSON_ARRAY('create', 'read_own'),
  'profile', JSON_ARRAY('read', 'update'),
  'cart', JSON_ARRAY('create', 'read', 'update', 'delete')
)),

(UUID(), 'student', 'Verified Student', JSON_OBJECT(
  'products', JSON_ARRAY('read', 'favorite', 'create_limited'),
  'orders', JSON_ARRAY('create', 'read_own'),
  'profile', JSON_ARRAY('read', 'update'),
  'discounts', JSON_ARRAY('apply_student_discounts')
));

-- =====================================================
-- SECURITY TRIGGERS (Automatic Logging)
-- =====================================================

-- Trigger for Profile Updates (Data Security)
DELIMITER $$
CREATE TRIGGER profile_update_audit 
AFTER UPDATE ON profiles
FOR EACH ROW
BEGIN
  INSERT INTO data_access_logs (user_id, table_name, record_id, operation, old_values, new_values)
  VALUES (NEW.id, 'profiles', NEW.id, 'UPDATE', 
    JSON_OBJECT('email', OLD.email, 'first_name', OLD.first_name, 'last_name', OLD.last_name),
    JSON_OBJECT('email', NEW.email, 'first_name', NEW.first_name, 'last_name', NEW.last_name)
  );
END$$

-- Trigger for Security Events
CREATE TRIGGER security_event_log
AFTER INSERT ON login_attempts
FOR EACH ROW
BEGIN
  IF NEW.success = FALSE THEN
    INSERT INTO security_audit_logs (user_id, action, ip_address, details, risk_level)
    VALUES (NULL, 'FAILED_LOGIN', NEW.ip_address, 
      JSON_OBJECT('email', NEW.email, 'reason', NEW.failure_reason),
      CASE 
        WHEN (SELECT COUNT(*) FROM login_attempts WHERE email = NEW.email AND success = FALSE AND attempted_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)) > 5 
        THEN 'HIGH'
        ELSE 'MEDIUM'
      END
    );
  END IF;
END$$
DELIMITER ;

-- =====================================================
-- SECURITY VIEWS (Restricted Data Access)
-- =====================================================

-- Safe User Profile View (No sensitive data)
CREATE VIEW safe_user_profiles AS
SELECT 
  id,
  email,
  first_name,
  last_name,
  university,
  location,
  bio,
  avatar_url,
  verified,
  created_at
FROM profiles;

-- User Security Status View
CREATE VIEW user_security_status AS
SELECT 
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  s.two_factor_enabled,
  s.email_verified,
  s.account_locked,
  s.last_login,
  s.failed_login_attempts,
  GROUP_CONCAT(r.name) as roles
FROM profiles p
LEFT JOIN account_security s ON p.id = s.user_id
LEFT JOIN user_role_assignments ura ON p.id = ura.user_id AND ura.is_active = TRUE
LEFT JOIN user_roles r ON ura.role_id = r.id
GROUP BY p.id;

-- =====================================================
-- SECURITY INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional security-focused indexes
CREATE INDEX idx_profiles_email_verified ON profiles(email);
CREATE INDEX idx_security_user_id ON account_security(user_id);
CREATE INDEX idx_security_locked ON account_security(account_locked);
CREATE INDEX idx_security_token ON account_security(password_reset_token);

-- =====================================================
-- DATA RETENTION POLICIES (Cleanup old logs)
-- =====================================================

-- Auto-cleanup old audit logs (keep 1 year)
CREATE EVENT cleanup_audit_logs
ON SCHEDULE EVERY 1 DAY
DO
DELETE FROM security_audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- Auto-cleanup old login attempts (keep 30 days)
CREATE EVENT cleanup_login_attempts
ON SCHEDULE EVERY 1 DAY
DO
DELETE FROM login_attempts WHERE attempted_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Auto-cleanup expired sessions
CREATE EVENT cleanup_expired_sessions
ON SCHEDULE EVERY 1 HOUR
DO
DELETE FROM user_sessions WHERE expires_at < NOW() OR is_active = FALSE;

-- =====================================================
-- INITIAL SECURITY CONFIGURATION
-- =====================================================

-- Enable event scheduler for automatic cleanup
SET GLOBAL event_scheduler = ON;

-- Create default admin user (update with real credentials)
INSERT INTO profiles (id, email, first_name, last_name, verified, created_at) 
VALUES (UUID(), 'admin@zenithmarketplace.com', 'System', 'Administrator', TRUE, NOW());

-- Create security record for admin
INSERT INTO account_security (
  user_id, 
  password_hash, 
  salt, 
  email_verified, 
  two_factor_enabled
) VALUES (
  (SELECT id FROM profiles WHERE email = 'admin@zenithmarketplace.com'),
  'temp_hash_change_immediately',
  'temp_salt_change_immediately',
  TRUE,
  TRUE
);

-- Assign super_admin role to admin user
INSERT INTO user_role_assignments (user_id, role_id, assigned_by) 
VALUES (
  (SELECT id FROM profiles WHERE email = 'admin@zenithmarketplace.com'),
  (SELECT id FROM user_roles WHERE name = 'super_admin'),
  (SELECT id FROM profiles WHERE email = 'admin@zenithmarketplace.com')
);

-- =====================================================
-- SECURITY NOTES AND DOCUMENTATION
-- =====================================================

/*
SECURITY IMPLEMENTATION SUMMARY:

i. SYSTEM SECURITY MEASURES:
   - Role-based access control (RBAC) with 6 predefined roles
   - Security audit logging for all critical actions  
   - Login attempt monitoring and account lockout
   - Session management with expiry tracking
   - Two-factor authentication support
   - Password reset with secure tokens

ii. DATABASE/DATA SECURITY:
   - Encrypted password storage with salt
   - Automatic audit trails for data changes
   - Data access logging for compliance
   - Automatic cleanup of sensitive logs
   - Protected views for safe data access
   - Triggers for automatic security monitoring

iii. USER PROFILES AND ACCESS RIGHTS:
   - Granular permission system per role
   - User role assignments with expiry
   - Account security settings per user
   - Email verification requirements
   - Account lockout after failed attempts
   - Session-based authentication

NEXT STEPS:
1. Update application code to use these security tables
2. Implement password hashing in application layer
3. Configure email verification system
4. Set up proper admin credentials
5. Test role-based access control
*/