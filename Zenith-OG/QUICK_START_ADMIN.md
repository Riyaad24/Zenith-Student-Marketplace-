# Quick Start: Adding Admins to Zenith

## 🚀 Three Methods Available

### 1️⃣ **Web Interface** (Easiest - Recommended)

**Steps:**
1. Start server: `npm run dev`
2. Login at http://localhost:3002/login (use existing admin account)
3. Go to **Manage Users** → Click **Create User**
4. Fill in details:
   - Email: `[9digits]ads@my.richfield.ac.za`
   - Password: [strong password]
   - First/Last Name
   - Role: **Admin** ← Select this!
   - Student Number: [9 digits] ← Required for admins
5. Click **Create**

**Done!** ✅ Admin can now login immediately.

---

### 2️⃣ **Interactive Script** (Command Line)

```powershell
# Run the script
node add-admin-interactive.js

# Answer prompts:
Admin Email: 402306532ads@my.richfield.ac.za
Password: SecurePass123!
First Name: John
Last Name: Doe
Student Number: 402306532
University: [Enter for default]

# Type "done" when finished
```

**Pros:**
- Add multiple admins in one session
- No server needed
- Auto-detects student number from email

---

### 3️⃣ **Batch Script** (Bulk Creation)

Create `admins.json`:
```json
[
  {
    "email": "402306532ads@my.richfield.ac.za",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "studentNumber": "402306532"
  }
]
```

Run:
```powershell
node add-admin-interactive.js '[{"email":"402306532ads@my.richfield.ac.za","password":"SecurePass123!","firstName":"John","lastName":"Doe","studentNumber":"402306532"}]'
```

**Pros:**
- Perfect for bulk creation
- Can be automated
- JSON format for easy editing

---

## 🔐 Admin Credentials Format

**Email Pattern:**
```
[9 digits]ads@my.richfield.ac.za

Examples:
✅ 402306532ads@my.richfield.ac.za
✅ 123456789ads@my.richfield.ac.za
```

**Student Number:**
```
Must be exactly 9 digits
Examples:
✅ 402306532
✅ 123456789
```

---

## 📊 What Admins Get

All admins receive:
- ✅ **Full Permissions** (`*` wildcard)
- ✅ Admin role assignment
- ✅ Auto-verified email
- ✅ Auto-verified account
- ✅ Access to all admin portal features:
  - User Management
  - Product Management
  - Reports & Analytics
  - Audit Logs
  - Notifications
  - Support Tickets

---

## ⚠️ Common Issues

### "Student number is required"
**Fix:** Enter a 9-digit number in the Student Number field (web) or when prompted (script)

### "User already exists"
**Fix:** Script will update the existing user with admin permissions instead

### "Unauthorized" in web interface
**Fix:** 
1. Logout and login again
2. Make sure you're logged in as an admin
3. Check your account has admin record in database

---

## 🔍 Verify Admin Was Created

**Quick SQL Check:**
```sql
SELECT u.email, a.studentNumber, a.permissions, a.isActive
FROM users u
INNER JOIN admins a ON u.id = a.user_id
WHERE u.email = 'your-admin-email@my.richfield.ac.za';
```

**Expected Result:**
```
email: your-admin-email@my.richfield.ac.za
studentNumber: [9 digits]
permissions: ["*"]
isActive: 1
```

---

## 📚 Full Documentation

For detailed information, see: **ADMIN_MANAGEMENT_GUIDE.md**

---

## 🆘 Need Help?

1. Check server console for errors
2. Review `/admin/logs` for audit trail
3. See `ADMIN_PORTAL_TESTING.md` for testing procedures
4. Check `ADMIN_MANAGEMENT_GUIDE.md` for troubleshooting

---

**Last Updated:** November 4, 2025
