# ZENITH MARKETPLACE - LOGIN TROUBLESHOOTING GUIDE

## ✅ FIXES APPLIED

### 1. Fixed Viewport Warning
- ✅ Moved `viewport` from `metadata` export to separate `viewport` export in `app/layout.tsx`
- ✅ This resolves the Next.js 15 metadata warning

### 2. Created API Route Authentication
- ✅ Added `app/api/auth/login/route.ts` - Direct API endpoint for login
- ✅ Added `app/api/auth/register/route.ts` - Direct API endpoint for registration
- ✅ These provide alternative authentication methods if Server Actions fail

## 🔧 SETUP STEPS TO FIX LOGIN ISSUES

### Step 1: Set Up Environment Variables
1. Copy `.env.local` to `.env` in your `Zenith-OG` directory:
```bash
cd Zenith-OG
copy .env.local .env
```

2. Edit `.env` file with your actual MySQL database credentials:
```bash
DATABASE_URL="mysql://your_username:your_password@localhost:3306/zenith_marketplace"
NEXTAUTH_SECRET="your-32-character-secret-key-here"
```

### Step 2: Set Up MySQL Database
1. Open MySQL Workbench
2. Create the database:
```sql
CREATE DATABASE IF NOT EXISTS zenith_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Run the realistic sample data script you created earlier:
   - Open `realistic_sample_data.sql` in MySQL Workbench
   - Execute the script

### Step 3: Generate Prisma Client
```bash
cd Zenith-OG
npm run db:generate
```

### Step 4: Test Database Connection
```bash
cd Zenith-OG
npm run db:studio
```
This should open Prisma Studio to verify your database connection.

### Step 5: Start the Development Server
```bash
cd Zenith-OG
npm run dev
```

## 🧪 TEST YOUR LOGIN

### Option 1: Use Server Actions (Original Method)
- Go to `http://localhost:3000/login`
- Try logging in with any of the sample users:
  - Email: `john.smith@uct.ac.za`
  - Password: `StudentPass123!`

### Option 2: Use New API Routes
You can test the API endpoints directly:

**Login API:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.smith@uct.ac.za","password":"StudentPass123!"}'
```

**Register API:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"TestPass123!",
    "firstName":"Test",
    "lastName":"User",
    "university":"University of Cape Town"
  }'
```

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: Database Connection Error
**Error:** `PrismaClientInitializationError`
**Solution:** 
- Check your `DATABASE_URL` in `.env`
- Ensure MySQL server is running
- Verify database credentials

### Issue 2: Missing Tables
**Error:** `Table 'zenith_marketplace.User' doesn't exist`
**Solution:**
- Run the `realistic_sample_data.sql` script in MySQL Workbench
- Or run: `npm run db:push` to sync Prisma schema

### Issue 3: JWT Token Error
**Error:** `JsonWebTokenError: secret or private key is required`
**Solution:**
- Set `NEXTAUTH_SECRET` in your `.env` file
- Make sure it's at least 32 characters long

### Issue 4: Prisma Client Not Generated
**Error:** `Cannot find module '@prisma/client'`
**Solution:**
```bash
npm install @prisma/client
npm run db:generate
```

## 📋 NEXT STEPS AFTER LOGIN WORKS

1. **Test Registration:**
   - Create a new account at `/register`
   - Verify it appears in your database

2. **Test Authentication State:**
   - Check if user stays logged in after page refresh
   - Test logout functionality

3. **Test Protected Routes:**
   - Try accessing `/account` page
   - Test creating products at `/sell`

## 🚨 IF ISSUES PERSIST

1. **Check Browser Console:**
   - Look for any JavaScript errors
   - Check Network tab for failed API calls

2. **Check Server Logs:**
   - Look at your terminal running `npm run dev`
   - Check for any error messages

3. **Database Verification:**
   - Open Prisma Studio: `npm run db:studio`
   - Verify tables exist and have data
   - Check if test users are in the database

4. **Environment Check:**
   - Verify `.env` file exists in `Zenith-OG` directory
   - Confirm all required environment variables are set

## 📞 NEED HELP?

If you're still having issues:
1. Share the exact error message from browser console
2. Share any server error logs
3. Confirm which steps you've completed above

Your login should work after following these steps!