# Admin Portal Testing Guide

## Prerequisites
1. Database is set up and Prisma migrations applied
2. Backend server is running
3. Admin users have been created using the setup script

## Test Admin Credentials
Use the setup script to create test admins:
```bash
cd Zenith-OG
node setup-admin-users.js
```

This creates admins with pattern: `123456789ads@my.richfield.ac.za` to `123456797ads@my.richfield.ac.za`

## API Testing with curl

### 1. Admin Signup (Should respect quota)
```bash
# Valid admin signup (if under quota)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Admin",
    "email": "123456798ads@my.richfield.ac.za",
    "password": "password123",
    "phone": "0123456789",
    "userType": "admin"
  }'

# Should return success if under quota, error if over quota
```

### 2. Admin Login
```bash
# Login as admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "123456789ads@my.richfield.ac.za",
    "password": "securepassword123"
  }'

# Should return token and isAdmin: true, redirectUrl: "/admin/dashboard"
```

### 3. Access Admin Dashboard Stats
```bash
# Get dashboard stats (use token from login)
curl -X GET http://localhost:3000/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Should return stats about users, admins, products, etc.
```

### 4. User Management
```bash
# Get all users
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get specific user
curl -X GET http://localhost:3000/api/admin/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Update user
curl -X PUT http://localhost:3000/api/admin/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }'

# Delete user
curl -X DELETE http://localhost:3000/api/admin/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Audit Logs
```bash
# Get admin actions
curl -X GET http://localhost:3000/api/admin/audit/actions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get admin sign-ins
curl -X GET http://localhost:3000/api/admin/audit/signins \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get with pagination
curl -X GET "http://localhost:3000/api/admin/audit/actions?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Frontend Testing

### 1. Admin Registration Flow
1. Go to `/register`
2. Try registering with:
   - Valid admin email (9digits + ads@my.richfield.ac.za)
   - Invalid admin email
   - When quota is full vs available

### 2. Admin Login Flow
1. Go to `/login`
2. Login with admin credentials
3. Should redirect to `/admin/dashboard`
4. Verify signin is logged in audit

### 3. Admin Dashboard
1. Access `/admin/dashboard`
2. Verify stats are displayed
3. Toggle between "Recent Actions" and "Admin Sign-ins"
4. Check all data loads properly

### 4. User Management
1. Go to `/admin/users`
2. View user list
3. Edit user details
4. Delete users
5. Verify all actions are audited

## Expected Behaviors

### Admin Signup
- ✅ Valid admin email pattern accepted
- ✅ Invalid patterns rejected
- ✅ Quota enforcement (max 14 admins)
- ✅ Student number extracted correctly

### Admin Login
- ✅ Admin users redirected to `/admin/dashboard`
- ✅ Non-admin users redirected to `/browse`
- ✅ Sign-ins are logged with IP and user agent

### Admin Portal
- ✅ Only admins can access admin routes
- ✅ All admin actions are audited
- ✅ Dashboard shows real-time stats
- ✅ Audit logs are paginated and searchable

### Security
- ✅ JWT tokens required for admin routes
- ✅ Admin middleware validates user permissions
- ✅ Audit trail for all sensitive operations

## Common Issues & Solutions

### Token Issues
- Ensure token is included in Authorization header
- Check token format: `Bearer <token>`
- Verify token hasn't expired

### Database Connection
- Ensure MySQL is running
- Check Prisma connection string
- Run migrations if schema changes

### Permission Errors
- Verify user has admin role
- Check email pattern matching
- Ensure user exists in Admin table

## Monitoring Admin Activity

All admin actions are automatically logged to:
- `AdminAuditLog` table for actions
- `AdminSignInLog` table for sign-ins

View logs through:
- Admin dashboard UI
- Direct API endpoints
- Database queries for detailed analysis