# Authentication Flow Manual Testing Guide

## ✅ Secure Configuration Verification

### Pre-Test Checklist
- [x] `lib/config.ts` created with JWT validation
- [x] `.env.local` created with 128-character secure secret
- [x] All API routes updated to use `jwtSecret` from config
- [x] No hardcoded secrets remaining in codebase
- [x] Next.js server running on http://localhost:3000
- [x] Backend server running on http://localhost:3001

---

## 🧪 Manual Testing Steps

### Test 1: User Registration ✅

**URL**: http://localhost:3000/register

**Steps**:
1. Open http://localhost:3000/register in your browser
2. Fill in the registration form:
   - **First Name**: Test
   - **Last Name**: User
   - **Email**: Use a unique student email (e.g., `123456789@uct.ac.za`)
   - **Phone**: +27123456789
   - **Password**: TestPassword123
   - **University**: Select "University of Cape Town" from dropdown
3. Click "Create Account"

**Expected Result**:
- ✅ Account creation success message
- ✅ Automatic redirect to home page (/)
- ✅ User is logged in (check header for profile/logout buttons)
- ✅ JWT token stored in cookie (check browser DevTools → Application → Cookies)

**What to Check**:
- Open Browser DevTools (F12)
- Go to Network tab
- Look for the POST request to `/api/auth/register`
- Check the response:
  - Should return `{ success: true, token: "...", user: {...} }`
  - Token should be a long JWT string (3 parts separated by dots)
  - Cookie named `auth-token` should be set

---

### Test 2: User Login ✅

**URL**: http://localhost:3000/login

**Steps**:
1. If you're logged in, logout first
2. Go to http://localhost:3000/login
3. Enter credentials from Test 1:
   - **Email**: The student email you used
   - **Password**: TestPassword123
4. Click "Sign In"

**Expected Result**:
- ✅ "Login successful! Redirecting..." message
- ✅ Redirect to home page
- ✅ User authentication state updated
- ✅ JWT token refreshed

**What to Check**:
- Network tab → POST request to `/api/auth/login`
- Response should contain: `{ success: true, token: "...", user: {...} }`
- New JWT token set in cookies
- Token format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOi...` (3 base64 parts)

---

### Test 3: Invalid Login Credentials ✅

**Steps**:
1. Go to http://localhost:3000/login
2. Enter:
   - **Email**: Valid email from Test 1
   - **Password**: WrongPassword123 (incorrect)
3. Click "Sign In"

**Expected Result**:
- ❌ Error message: "Invalid email or password"
- ❌ No token set
- ❌ User remains logged out

**What to Check**:
- Response status: 401 Unauthorized
- No JWT token in response
- Error message displayed clearly

---

### Test 4: Protected Route - View Profile ✅

**URL**: http://localhost:3000/account

**Prerequisites**: Must be logged in

**Steps**:
1. While logged in, navigate to http://localhost:3000/account
2. Check that your profile information is displayed

**Expected Result**:
- ✅ Profile page loads successfully
- ✅ Displays user information (name, email, university)
- ✅ No authentication errors

**What to Check**:
- Network tab → GET request to `/api/auth/me`
- Request headers should include JWT token (cookie automatically sent)
- Response: `{ user: { id, email, firstName, lastName, ... } }`

---

### Test 5: Protected Route - Add Product ✅

**URL**: http://localhost:3000/sell

**Prerequisites**: Must be logged in

**Steps**:
1. Navigate to http://localhost:3000/sell
2. Fill in product details
3. Upload an image
4. Click "List Product"

**Expected Result**:
- ✅ Product creation form accessible
- ✅ Can upload images
- ✅ Product created successfully
- ✅ JWT authentication works for product creation

**What to Check**:
- Network tab → POST request to `/api/products`
- Authorization header or cookie contains JWT
- Response confirms product creation

---

### Test 6: Logout ✅

**Steps**:
1. Click on your profile dropdown in the header
2. Click "Logout"

**Expected Result**:
- ✅ User logged out
- ✅ JWT cookie removed/cleared
- ✅ Redirect to home page
- ✅ Header shows "Login" and "Sign Up" buttons again

---

### Test 7: Access Protected Route While Logged Out ❌

**Steps**:
1. Make sure you're logged out
2. Try to access http://localhost:3000/account directly

**Expected Result**:
- ❌ Redirect to /login page
- ❌ Message: "Please login to continue"

---

## 🔐 JWT Token Validation Tests

### Test 8: Inspect JWT Token Structure

**Steps**:
1. Login successfully
2. Open Browser DevTools → Application → Cookies
3. Find the `auth-token` cookie
4. Copy the value
5. Go to https://jwt.io
6. Paste the token in the "Encoded" field

**Expected Result**:
- ✅ Token has 3 parts (header.payload.signature)
- ✅ Header contains: `{ "alg": "HS256", "typ": "JWT" }`
- ✅ Payload contains: `{ "userId": "...", "email": "...", "roles": [...], "iat": ..., "exp": ... }`
- ✅ Token is NOT signed with "your-secret-key" or "fallback-secret"
- ✅ Signature verification will fail on jwt.io (because it doesn't have your secret - this is GOOD!)

**What to Check**:
- `exp` (expiration) field should be ~24 hours from `iat` (issued at)
- `userId` matches your user ID
- `email` matches your login email
- `roles` array contains appropriate roles

---

### Test 9: Token Expiration

**Steps**:
1. Login and get a token
2. Wait 24 hours (or modify `JWT_EXPIRES_IN` in .env.local to "1m" for testing)
3. Try to access a protected route

**Expected Result**:
- ❌ Token expired error
- ❌ Redirect to login page
- ✅ Error message: "Session expired, please login again"

---

### Test 10: Invalid Token Rejection

**Steps**:
1. Open Browser DevTools → Application → Cookies
2. Edit the `auth-token` cookie value to something invalid like `invalid.token.here`
3. Try to access http://localhost:3000/account

**Expected Result**:
- ❌ 401 Unauthorized error
- ❌ Token verification fails
- ❌ User redirected to login

---

## 🎯 Configuration Validation Tests

### Test 11: Check Environment Variables

**Steps**:
1. Open `.env.local` file
2. Verify `NEXTAUTH_SECRET` is present and long (128+ characters)
3. Verify it's NOT "your-secret-key" or "fallback-secret"

**Expected Result**:
```env
NEXTAUTH_SECRET="7b5106b64e4470356a3c80ca6066982366e7fdac9a7276a364d423da098edc6b..."
```
- ✅ 128 characters long
- ✅ Hexadecimal format
- ✅ Cryptographically secure

---

### Test 12: Code Review - No Hardcoded Secrets

**Steps**:
```powershell
cd "C:\Users\riyaa\Zenith-Student-Marketplace-\Zenith-Student-Marketplace-\Zenith-OG"
Select-String -Path "app\api\**\*.ts" -Pattern "your-secret-key|fallback-secret"
```

**Expected Result**:
- ✅ No matches found
- ✅ All routes use `import { jwtSecret } from '@/lib/config'`

---

### Test 13: Admin Login (if applicable)

**URL**: http://localhost:3000/login

**Steps**:
1. Login with an admin email (e.g., `admin@uct.ac.za`)
2. Check that admin role is properly assigned

**Expected Result**:
- ✅ Login successful
- ✅ JWT payload contains `"roles": ["admin"]`
- ✅ Redirect to `/admin/dashboard`
- ✅ Admin features accessible

---

## 📊 Test Results Checklist

### Authentication Core
- [ ] User Registration works
- [ ] User Login works
- [ ] Invalid credentials rejected
- [ ] JWT token generated correctly
- [ ] Token has correct structure (3 parts)
- [ ] Token contains correct user data
- [ ] Token expiration set to 24 hours

### Protected Routes
- [ ] Profile page requires authentication
- [ ] Product creation requires authentication
- [ ] Wishlist requires authentication
- [ ] Unauthorized access redirects to login

### Security
- [ ] No hardcoded secrets in code
- [ ] JWT secret is 128+ characters
- [ ] Invalid tokens are rejected
- [ ] Expired tokens are rejected
- [ ] Wrong passwords rejected
- [ ] Token signature cannot be verified externally (without secret)

### User Experience
- [ ] Success/error messages display correctly
- [ ] Automatic redirect after login/logout
- [ ] Auth state persists across page refreshes
- [ ] Logout clears authentication state

---

## 🔍 Debugging Tips

### If Registration Fails:
1. Check Network tab for error response
2. Verify database is running: `npx prisma studio`
3. Check `.env.local` has correct DATABASE_URL
4. Verify student email format is correct

### If Login Fails:
1. Check if user exists in database
2. Verify password was hashed correctly during registration
3. Check JWT secret is loaded from .env.local
4. Look at console errors in DevTools

### If Protected Routes Fail:
1. Check if cookie is being sent with request
2. Verify JWT token is valid (not expired)
3. Check API route has correct JWT verification code
4. Ensure `jwtSecret` import is present

### If JWT Token Issues:
1. Verify `.env.local` exists and has NEXTAUTH_SECRET
2. Check lib/config.ts is loading environment variables
3. Restart Next.js server after changing .env files
4. Clear browser cookies and try again

---

## ✅ Success Criteria

**All tests pass if**:
- ✅ Users can register and login successfully
- ✅ JWT tokens are generated with secure secret (128 chars)
- ✅ Protected routes require valid authentication
- ✅ Invalid/expired tokens are rejected
- ✅ No hardcoded secrets in codebase
- ✅ Configuration is centralized in lib/config.ts
- ✅ All API routes use imported jwtSecret
- ✅ Security score improved from 60/100 to 90+/100

**Current Status**: ✅ READY FOR TESTING

---

## 📝 Notes

- JWT secret is stored in `.env.local` (NOT committed to git)
- Production deployment requires generating new secret for `.env` on hosting platform
- Token expiration can be adjusted via `JWT_EXPIRES_IN` environment variable
- Admin users have additional `roles: ["admin"]` in JWT payload
- All API routes now use centralized configuration from `lib/config.ts`
