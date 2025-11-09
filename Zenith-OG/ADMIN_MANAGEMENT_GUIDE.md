# Zenith Admin Portal - Admin Management Guide

This guide explains how to add and manage admin users in the Zenith Student Marketplace admin portal.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Method 1: Web Interface (Recommended)](#method-1-web-interface-recommended)
3. [Method 2: Interactive Script](#method-2-interactive-script)
4. [Method 3: Batch Script](#method-3-batch-script)
5. [Admin Permissions](#admin-permissions)
6. [Troubleshooting](#troubleshooting)

---

## Overview

Zenith supports **three ways** to add admin users:

| Method | Best For | Requires Server |
|--------|----------|-----------------|
| **Web Interface** | Single admin creation, visual interface | Yes ✅ |
| **Interactive Script** | Multiple admins, command-line comfort | No ❌ |
| **Batch Script** | Bulk admin creation, automation | No ❌ |

---

## Method 1: Web Interface (Recommended)

### Prerequisites
- Server must be running (`npm run dev`)
- You must be logged in as an existing admin
- Access to http://localhost:3002/admin/users

### Steps

1. **Navigate to Admin Portal**
   ```
   http://localhost:3002/login
   ```
   Login with your admin credentials

2. **Go to User Management**
   - Click "Manage Users" in the dashboard
   - Or navigate to http://localhost:3002/admin/users

3. **Click "Create User" Button**
   - Located in the top right corner

4. **Fill in Admin Details**
   ```
   Email:          [admin-email]@my.richfield.ac.za
   Password:       [strong-password]
   First Name:     [first-name]
   Last Name:      [last-name]
   University:     Richfield Graduate Institute
   Phone:          [optional]
   Role:           Admin ⬅️ IMPORTANT!
   Student Number: [9-digit number] ⬅️ Required for admins
   ```

5. **Click "Create"**
   - Admin will be created with full permissions (`*`)
   - They can immediately log in

### Example

```
Email:          402306532ads@my.richfield.ac.za
Password:       SecurePass123!
First Name:     John
Last Name:      Doe
University:     Richfield Graduate Institute
Phone:          +27821234567
Role:           Admin
Student Number: 402306532
```

### Features

✅ **Auto-detection**: If email matches pattern `[9digits]ads@my.richfield.ac.za`, student number is auto-extracted  
✅ **Validation**: Form validates all required fields before submission  
✅ **Real-time**: Changes appear immediately in the user list  
✅ **Audit Trail**: All admin creations are logged  

---

## Method 2: Interactive Script

### Prerequisites
- Node.js installed
- Database connection configured
- `bcryptjs` package installed

### Usage

```powershell
# Navigate to project directory
cd "c:\Users\riyaa\Zenith-Student-Marketplace-\Zenith-Student-Marketplace-\Zenith-OG"

# Run the interactive script
node add-admin-interactive.js
```

### Interactive Prompts

The script will ask for:

```
╔════════════════════════════════════════════════╗
║   Zenith Admin Portal - Add Admin Users       ║
╚════════════════════════════════════════════════╝

─────────────────────────────────────────────────
Admin Email (or "done" to finish): 402306532ads@my.richfield.ac.za
Password: SecurePass123!
First Name: John
Last Name: Doe
  → Detected student number: 402306532
University (press Enter for "Richfield Graduate Institute"): 

🔍 Processing admin: 402306532ads@my.richfield.ac.za
  📝 Creating new admin user...
  ✅ Admin user created successfully!

✅ Success!

─────────────────────────────────────────────────
Admin Email (or "done" to finish): done

╔════════════════════════════════════════════════╗
║              Summary                           ║
╚════════════════════════════════════════════════╝

✅ 402306532ads@my.richfield.ac.za - Created
```

### Features

✅ **Smart Detection**: Automatically extracts student number from email if it matches pattern  
✅ **Multiple Admins**: Add multiple admins in one session  
✅ **Update Existing**: Updates password if admin already exists  
✅ **Summary Report**: Shows success/failure for each admin  

### Exit Commands

Type any of these to finish:
- `done`
- `exit`
- `q`

---

## Method 3: Batch Script

### Prerequisites
Same as Interactive Script

### Usage

Create a JSON file with admin data, then pass it to the script:

```powershell
# Example 1: Inline JSON
node add-admin-interactive.js '[{"email":"admin1@my.richfield.ac.za","password":"Pass123!","firstName":"John","lastName":"Doe","studentNumber":"123456789"}]'

# Example 2: From JSON file (PowerShell)
$admins = Get-Content admins.json -Raw
node add-admin-interactive.js $admins
```

### JSON Format

Create a file named `admins.json`:

```json
[
  {
    "email": "402306532ads@my.richfield.ac.za",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "studentNumber": "402306532",
    "university": "Richfield Graduate Institute"
  },
  {
    "email": "123456789ads@my.richfield.ac.za",
    "password": "AdminPass456!",
    "firstName": "Jane",
    "lastName": "Smith",
    "studentNumber": "123456789"
  }
]
```

### Example Output

```
╔════════════════════════════════════════════════╗
║   Zenith Admin Portal - Batch Add Admins      ║
╚════════════════════════════════════════════════╝

🔍 Processing admin: 402306532ads@my.richfield.ac.za
  📝 Creating new admin user...
  ✅ Admin user created successfully!

🔍 Processing admin: 123456789ads@my.richfield.ac.za
  ✅ User already exists
  🔑 Password updated
  ✅ Admin permissions updated to full access

╔════════════════════════════════════════════════╗
║              Summary                           ║
╚════════════════════════════════════════════════╝

✅ 402306532ads@my.richfield.ac.za - Created
✅ 123456789ads@my.richfield.ac.za - Updated
```

---

## Admin Permissions

### Full Access Wildcard

All admins created through any method receive **full permissions** with the wildcard permission:

```javascript
permissions: ['*']
```

This grants access to:
- ✅ User Management (view, create, update, delete)
- ✅ Product Management (view, update, delete)
- ✅ Order Management (view, update)
- ✅ Reports and Analytics
- ✅ Audit Logs
- ✅ Notifications
- ✅ Support Tickets
- ✅ System Settings

### Role Assignment

Admins automatically receive:
1. **Admin Role** in `user_role_assignments` table
2. **Admin Record** in `admins` table with full permissions
3. **Email Verification** auto-verified
4. **Account Verification** auto-verified

---

## Troubleshooting

### Issue: "User already exists"

**Solution**: The script will update the existing user instead of creating new one:
- Password will be updated
- Admin permissions will be granted/updated
- Admin role will be assigned

### Issue: "Student number is required for admin users"

**Solution**: Provide a 9-digit student number in one of these ways:
1. **Web Interface**: Fill in the "Student Number" field
2. **Interactive Script**: Enter when prompted, or use email pattern `[9digits]ads@my.richfield.ac.za`
3. **Batch Script**: Include `studentNumber` in JSON

### Issue: Script fails with database error

**Check**:
1. Is MySQL running?
2. Is `.env` configured correctly?
3. Run `npx prisma generate` to ensure schema is up to date
4. Check database connection:
   ```powershell
   node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => console.log('✅ Connected')).catch(e => console.error('❌ Error:', e))"
   ```

### Issue: Web interface shows "Unauthorized"

**Solution**: 
1. Make sure you're logged in as an admin
2. Check that your auth token is valid (try logging out and back in)
3. Verify your user has admin record in database:
   ```sql
   SELECT u.email, a.id, a.permissions 
   FROM users u 
   LEFT JOIN admins a ON u.id = a.user_id 
   WHERE u.email = 'your-email@my.richfield.ac.za';
   ```

### Issue: "Failed to create user" in web interface

**Check Browser Console**:
1. Press F12 to open DevTools
2. Go to Console tab
3. Look for error messages
4. Common causes:
   - Email already exists
   - Missing required fields
   - Invalid student number format (must be 9 digits)

---

## Admin Email Pattern

Zenith recognizes admin emails with this pattern:

```
[9 digits]ads@my.richfield.ac.za
```

### Valid Examples:
- ✅ `402306532ads@my.richfield.ac.za`
- ✅ `123456789ads@my.richfield.ac.za`
- ✅ `987654321ads@my.richfield.ac.za`

### Invalid Examples:
- ❌ `admin@my.richfield.ac.za` (no student number)
- ❌ `12345ads@my.richfield.ac.za` (not 9 digits)
- ❌ `402306532@my.richfield.ac.za` (missing 'ads')

**Note**: The web interface and scripts support any email format, but require explicit student number input for non-pattern emails.

---

## Security Best Practices

### Password Requirements

Enforce strong passwords:
- ✅ Minimum 8 characters
- ✅ Mix of uppercase and lowercase
- ✅ Include numbers
- ✅ Include special characters
- ✅ No common passwords (Password123, Admin123, etc.)

### Example Strong Passwords:
- `SecureP@ss2024!`
- `Zenith#Admin99`
- `MyStr0ng!Passw0rd`

### Admin Account Security

1. **Change Default Passwords**: Always change passwords after first login
2. **Unique Passwords**: Each admin should have a unique password
3. **Regular Updates**: Update passwords every 90 days
4. **Two-Factor Auth**: Consider implementing 2FA (future feature)
5. **Audit Logs**: Regularly review admin actions in audit logs

---

## Quick Reference

### Add Single Admin (Web)
```
1. Login → Admin Portal
2. Manage Users → Create User
3. Fill form → Select "Admin" role
4. Enter student number → Create
```

### Add Single Admin (Script)
```powershell
node add-admin-interactive.js
# Follow prompts
```

### Add Multiple Admins (Batch)
```powershell
node add-admin-interactive.js '[{"email":"...","password":"...","firstName":"...","lastName":"...","studentNumber":"..."}]'
```

### Check Admin Status
```sql
-- In MySQL
SELECT 
  u.id,
  u.email,
  u.firstName,
  u.lastName,
  a.studentNumber,
  a.permissions,
  a.isActive
FROM users u
INNER JOIN admins a ON u.id = a.user_id
WHERE a.isActive = true;
```

---

## Support

For issues or questions:

1. **Check Logs**: Look in server console for error messages
2. **Review Audit**: Check `/admin/logs` for admin actions
3. **Database Check**: Verify records in `users`, `admins`, `user_roles` tables
4. **Documentation**: Review `ADMIN_PORTAL_TESTING.md` for testing procedures

---

## Related Files

- `add-admin-interactive.js` - Interactive admin creation script
- `add-riyaad-admin.js` - Example single admin script
- `app/admin/users/page.tsx` - Web interface for user management
- `app/api/admin/users/route.ts` - API endpoint for user creation
- `middleware/adminAuth.ts` - Admin authentication logic
- `ADMIN_PORTAL_TESTING.md` - Testing procedures

---

**Last Updated**: November 4, 2025  
**Version**: 2.0  
**Author**: Zenith Development Team
