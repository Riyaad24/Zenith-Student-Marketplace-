# MySQL Migration Guide
## Zenith Student Marketplace Database Migration

### 🔄 **Migration Overview**
This guide covers the complete migration from SQLite/PostgreSQL to MySQL for the Zenith Student Marketplace project.

---

## 📋 **Pre-Migration Checklist**

### **1. MySQL Installation & Setup**
```bash
# Install MySQL Server (Windows)
# Download from: https://dev.mysql.com/downloads/mysql/
# Or use MySQL Installer: https://dev.mysql.com/downloads/installer/

# For development, you can also use:
# - XAMPP (includes MySQL)
# - MAMP 
# - Docker MySQL container
```

### **2. Create MySQL Database**
```sql
-- Connect to MySQL and create database
CREATE DATABASE zenith_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create a dedicated user (recommended for production)
CREATE USER 'zenith_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON zenith_marketplace.* TO 'zenith_user'@'localhost';
FLUSH PRIVILEGES;
```

### **3. Environment Configuration**
```bash
# Copy the example environment file
cp .env.example .env

# Update DATABASE_URL in .env file:
DATABASE_URL="mysql://zenith_user:secure_password@localhost:3306/zenith_marketplace"
```

---

## 🛠️ **Migration Steps**

### **Step 1: Install Dependencies**
```bash
# Navigate to project directory
cd Zenith-OG

# Install/update Prisma (if needed)
npm install prisma @prisma/client

# Generate Prisma Client for MySQL
npm run db:generate
```

### **Step 2: Database Schema Migration**
```bash
# Option A: Use Prisma Migrate (Recommended)
npm run db:migrate
# This will create the first migration and apply it

# Option B: Push schema directly (for development)
npm run db:push
```

### **Step 3: Seed Database**
```bash
# Run the seed script to populate initial data
npm run db:seed
```

### **Step 4: Verify Migration**
```bash
# Open Prisma Studio to verify data
npm run db:studio
# This will open http://localhost:5555
```

---

## 🔍 **Key Changes Made**

### **1. Prisma Schema Updates**
- ✅ Changed provider from `sqlite` to `mysql`
- ✅ Updated field types for MySQL compatibility
- ✅ Maintained all relationships and constraints

### **2. SQL Scripts Conversion**
**PostgreSQL → MySQL Changes:**
- `UUID` → `VARCHAR(36) DEFAULT (UUID())`
- `TEXT` → `VARCHAR(255)` or `TEXT`
- `BOOLEAN` → `BOOLEAN` (native MySQL support)
- `TIMESTAMP WITH TIME ZONE` → `TIMESTAMP`
- `ARRAY[]` → `JSON` (for array data)
- `public.` schema prefix → removed
- `REFERENCES` → `FOREIGN KEY` constraints
- Row Level Security → Application-level security

### **3. New MySQL Features**
- ✅ Added proper `ENUM` types for status fields
- ✅ Created performance indexes
- ✅ Added `ON UPDATE CURRENT_TIMESTAMP` for automatic timestamps
- ✅ Used JSON fields for array data (images, tags)
- ✅ Added proper foreign key constraints with cascading

---

## 🚨 **Important Notes**

### **Security Considerations**
```
⚠️  MySQL doesn't have Row Level Security (RLS) like PostgreSQL
✅  Implement security at application level:
    - Use middleware for user authentication
    - Filter queries based on user context
    - Validate user permissions in API routes
```

### **Data Type Differences**
| PostgreSQL | MySQL | Notes |
|------------|--------|-------|
| `UUID` | `VARCHAR(36)` | Using UUID() function |
| `TEXT[]` | `JSON` | Arrays stored as JSON |
| `TIMESTAMP WITH TIME ZONE` | `TIMESTAMP` | Time zone handled in app |
| `gen_random_uuid()` | `UUID()` | MySQL 8.0+ function |

### **Performance Optimizations**
- ✅ Added indexes for common query patterns
- ✅ Used appropriate field sizes (VARCHAR vs TEXT)
- ✅ Implemented proper foreign key relationships
- ✅ Added composite unique constraints where needed

---

## 🧪 **Testing the Migration**

### **1. Connection Test**
```javascript
// Test database connection
// In your Next.js API route or component:
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ MySQL connection successful');
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}
```

### **2. Data Verification**
```bash
# Check if tables were created
npm run db:studio

# Or use MySQL command line:
mysql -u zenith_user -p zenith_marketplace
SHOW TABLES;
DESCRIBE products;
SELECT COUNT(*) FROM categories;
```

---

## 🔧 **Troubleshooting**

### **Common Issues & Solutions**

#### **Issue: Connection Refused**
```bash
# Check MySQL service is running
# Windows: Services.msc → Find MySQL
# Or restart MySQL service

# Verify connection details in .env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

#### **Issue: Authentication Plugin Error**
```sql
-- Update MySQL user authentication (MySQL 8.0+)
ALTER USER 'zenith_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
```

#### **Issue: Prisma Generate Fails**
```bash
# Clear Prisma cache and regenerate
npx prisma generate --force
```

#### **Issue: Migration Conflicts**
```bash
# Reset database (CAUTION: Deletes all data)
npm run db:reset

# Or manually drop and recreate
DROP DATABASE zenith_marketplace;
CREATE DATABASE zenith_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 📈 **Next Steps**

### **1. Production Deployment**
- Consider cloud MySQL services (AWS RDS, Google Cloud SQL, PlanetScale)
- Set up proper backup strategies
- Configure SSL connections
- Implement connection pooling

### **2. Application Updates**
- Update any hardcoded SQL queries
- Test all CRUD operations
- Verify authentication flows work
- Check file upload/image handling

### **3. Performance Monitoring**
- Set up MySQL performance monitoring
- Monitor query performance
- Optimize slow queries
- Consider read replicas for scaling

---

## ✅ **Migration Completion Checklist**

- [ ] MySQL server installed and running
- [ ] Database and user created
- [ ] Environment variables updated
- [ ] Prisma schema migrated
- [ ] Database tables created
- [ ] Seed data inserted
- [ ] Application connects successfully
- [ ] All CRUD operations tested
- [ ] Authentication flows verified
- [ ] Performance benchmarked

---

*Migration completed successfully! Your Zenith Student Marketplace is now running on MySQL.*