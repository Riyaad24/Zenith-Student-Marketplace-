# 🧪 API Testing Script for Demo

## Test Endpoints (Copy-paste ready for Postman/Thunder Client)

### 1. Health Check
```http
GET http://localhost:3001/health
```

### 2. API Status
```http
GET http://localhost:3001/api/status
```

### 3. Browse Products (No Auth Required)
```http
GET http://localhost:3000/api/products?page=1&limit=5
```

### 4. Browse Products with Filters
```http
GET http://localhost:3000/api/products?category=textbooks&minPrice=50&maxPrice=200&university=richfield&condition=used
```

### 5. User Registration
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "demo@student.richfield.ac.za",
  "password": "DemoPassword123!",
  "firstName": "Demo",
  "lastName": "Student",
  "university": "Richfield Graduate Institute",
  "phone": "+27123456789"
}
```

### 6. User Login
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "demo@student.richfield.ac.za",
  "password": "DemoPassword123!"
}
```

### 7. Admin Login (if admin exists)
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "123456789ads@my.richfield.ac.za",
  "password": "AdminPassword123!"
}
```

### 8. Get Current User (Requires Auth Token)
```http
GET http://localhost:3000/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### 9. Create Product (Requires Auth Token)
```http
POST http://localhost:3000/api/products
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE

{
  "title": "Introduction to Computer Science Textbook",
  "description": "Comprehensive textbook for first-year computer science students. Excellent condition with minimal highlighting.",
  "price": 450.00,
  "quantity": 1,
  "category": "textbooks",
  "condition": "used",
  "city": "Johannesburg",
  "campus": "Richfield Graduate Institute",
  "images": [
    "https://example.com/textbook1.jpg",
    "https://example.com/textbook2.jpg"
  ],
  "contactPreferences": {
    "email": true,
    "phone": false,
    "messaging": true
  }
}
```

### 10. Admin Dashboard Stats (Requires Admin Token)
```http
GET http://localhost:3000/api/admin/dashboard/stats
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN_HERE
```

### 11. Admin User List (Requires Admin Token)
```http
GET http://localhost:3000/api/admin/users?page=1&limit=10
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN_HERE
```

### 12. Get Notifications (Requires Auth Token)
```http
GET http://localhost:3000/api/notifications
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 🎯 Demo Flow Suggestions:

### Quick Demo (3-5 minutes):
1. Health check (show both backends running)
2. Product listing (show filtering)
3. User authentication (show JWT generation)
4. Product creation (show authenticated endpoint)

### Full Demo (7-10 minutes):
1. Health monitoring
2. Database schema walkthrough
3. User registration → login → token
4. Product CRUD operations
5. Admin authentication
6. Admin dashboard access
7. Security audit logs

### Error Handling Demo:
1. Invalid login credentials
2. Missing authentication token
3. Invalid product data
4. Admin-only endpoint access

---

## 🛠️ Demo Preparation Checklist:

### Before Starting:
- [ ] Both servers running (3000 & 3001)
- [ ] Database connected and seeded
- [ ] Postman/Thunder Client ready
- [ ] VS Code open with key files
- [ ] Browser tabs prepared

### Key Files to Have Open:
- [ ] `prisma/schema.prisma` (database schema)
- [ ] `app/api/auth/login/route.ts` (authentication)
- [ ] `app/api/products/route.ts` (main functionality)
- [ ] `app/api/admin/dashboard/stats/route.ts` (admin features)
- [ ] `backend/index.js` (health monitoring)

### Demo Data to Prepare:
- [ ] Sample user account for login
- [ ] Sample admin account (if available)
- [ ] Sample products in database
- [ ] Sample categories created

### Backup Plans:
- [ ] Screenshots of successful responses
- [ ] Recorded demo video
- [ ] Sample JSON responses to show
- [ ] Database query examples

---

## 💡 Presentation Tips:

### What to Emphasize:
1. **Production Ready**: Real error handling, security, scalability
2. **Complex Architecture**: 20+ models, comprehensive API
3. **Security First**: Admin controls, audit trails, authentication
4. **University Focus**: Student verification, multi-campus support

### Common Questions to Prepare For:
- "How does it handle concurrent users?"
- "What about payment processing?"
- "How secure is the admin system?"
- "Can it scale to multiple universities?"
- "What about mobile app support?"

### Technical Details to Highlight:
- JWT authentication with roles
- Prisma ORM with type safety
- Comprehensive audit logging
- Real-time health monitoring
- Advanced filtering capabilities