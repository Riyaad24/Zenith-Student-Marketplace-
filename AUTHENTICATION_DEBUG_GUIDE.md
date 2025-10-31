# Authentication Debug Guide

## Current Issue
Users can log in successfully (API returns 200, token generated, cookie set), but after redirect they appear logged out again - creating an authentication loop.

## What We've Fixed So Far
✅ Replaced mock authentication with real API calls  
✅ Added HTTP-only cookie setting in login/register API routes  
✅ Made `refreshUser()` async and properly awaited it  
✅ Changed from `router.push()` to `window.location.href` for full page reload  
✅ Added `credentials: 'include'` to all fetch calls  
✅ Added `cache: 'no-store'` to prevent stale auth data  
✅ Added comprehensive console logging throughout the flow  

## Authentication Flow

### 1. User Submits Login Form
**File**: `app/login/page.tsx`

**Expected Console Logs**:
```
🔐 Login attempt for: {email}
Login response: {success: true, user: {...}, token: "..."}
Response status: 200
Response headers: {...}
✅ Login successful
🔑 Token stored in localStorage
About to refresh user...
User refresh complete
Redirecting to: /
```

### 2. API Sets Cookie
**File**: `app/api/auth/login/route.ts`

**Expected Console Logs**:
```
Login API: User cookie set
```

### 3. Auth Provider Checks Authentication
**File**: `components/auth-provider.tsx`

**Expected Console Logs** (happens twice - once before login, once after):
```
checkAuth: Starting authentication check...
checkAuth: API response status: 200
checkAuth: User data received: {user: {...}}
✅ User authenticated: {email}
checkAuth: Complete
```

### 4. API Verifies Cookie
**File**: `app/api/auth/me/route.ts`

**Expected Console Logs**:
```
🔍 API /auth/me - Cookie present: true
🔍 API /auth/me - Token length: 200+
🔍 API /auth/me - All cookies: ['auth-token', ...]
✅ API /auth/me - Token decoded for user: {userId}
✅ API /auth/me - Returning user: {email}
```

## Debugging Steps

### Step 1: Check Console Logs
1. Open the website in browser
2. Open DevTools (F12) → Console tab
3. Attempt to log in
4. Watch the console logs carefully
5. Compare what you see vs. expected logs above

**If you see "❌ API /auth/me - No token found in cookies":**
→ Cookie is not being set or not being sent with requests

**If you see "❌ No user authenticated":**
→ `/api/auth/me` is returning 401

### Step 2: Check Cookies in Browser
1. Open DevTools (F12)
2. Go to **Application** tab
3. Expand **Cookies** in left sidebar
4. Click on `http://localhost:3000`
5. Look for `auth-token` cookie

**Cookie Should Have:**
- Name: `auth-token`
- Value: Long JWT string (200+ characters)
- HttpOnly: ✓ (checked)
- Secure: (blank in development)
- SameSite: Lax
- Max-Age: 86400 (24 hours)

**If cookie is missing:**
→ Cookie not being set by API route

**If cookie is present but expires immediately:**
→ Check Max-Age value

### Step 3: Check Network Requests
1. Open DevTools (F12)
2. Go to **Network** tab
3. Log in
4. Find the `/api/auth/me` request in the list
5. Click on it

**Check Request Headers:**
Should include: `Cookie: auth-token={long-string}`

**If "Cookie" header is missing:**
→ Browser is not sending the cookie (credentials: 'include' issue or CORS)

**Check Response:**
- Status should be `200 OK`
- Response body should have `{user: {...}}`

**If status is 401:**
→ Token verification failing

### Step 4: Check Terminal Logs
Look at the terminal where your **frontend** server is running (port 3000).

**You should see logs like:**
```
Login API: User cookie set
🔍 API /auth/me - Cookie present: true
✅ API /auth/me - Returning user: user@example.com
```

**If you see:**
```
❌ API /auth/me - No token found in cookies
```
→ Cookie not being received by API

## Common Issues & Solutions

### Issue 1: Cookie Not Being Set
**Symptom**: Cookie missing in DevTools → Application → Cookies

**Solution**: Check that login/register API routes have:
```typescript
const cookieStore = await cookies()
cookieStore.set('auth-token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24,
})
```

### Issue 2: Cookie Not Being Sent
**Symptom**: Cookie present in Application tab, but not in Network → Request Headers

**Solution**: Verify all fetch calls include:
```typescript
fetch('/api/auth/me', {
  credentials: 'include', // This is critical!
  cache: 'no-store'
})
```

### Issue 3: SameSite Blocking
**Symptom**: Cookie set but immediately deleted

**Solution**: Try changing cookie settings:
```typescript
cookieStore.set('auth-token', token, {
  httpOnly: true,
  secure: false, // Set to false in development
  sameSite: 'lax', // Try 'none' if 'lax' doesn't work
  path: '/',
  maxAge: 60 * 60 * 24,
})
```

### Issue 4: JWT Verification Failing
**Symptom**: Cookie sent but API returns 401

**Solution**: Check that NEXTAUTH_SECRET is the same in:
- `.env.local` file
- Login API route
- Register API route
- `/api/auth/me` route

Verify with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Issue 5: Timing/Race Condition
**Symptom**: Sometimes works, sometimes doesn't

**Solution**: Add delay before redirect:
```typescript
await refreshUser()
await new Promise(resolve => setTimeout(resolve, 100)) // 100ms delay
window.location.href = result.redirect || '/'
```

## Test Manually

### Test 1: Simple Login
1. Go to http://localhost:3000/login
2. Enter credentials
3. Click "Sign In"
4. Watch console logs
5. Check if redirected to home page
6. Check if header shows your name (not "Sign In")

### Test 2: Check Cookie Persistence
1. Log in successfully
2. Open DevTools → Application → Cookies
3. Verify `auth-token` is present
4. Manually navigate to http://localhost:3000/account
5. Check if you're still logged in (should see account page, not redirect to login)

### Test 3: Page Refresh
1. Log in successfully
2. Press F5 to refresh page
3. Check if you're still logged in

### Test 4: Browser DevTools Disabled
1. Close all DevTools
2. Log in normally
3. Check if it works (sometimes DevTools affects cookies)

## Next Steps Based on Findings

### If Cookie is Set But Not Sent:
- Issue with `credentials: 'include'`
- Check CORS configuration
- Try different SameSite values

### If Cookie is Not Set at All:
- API route not executing cookie setting code
- Check server terminal for "Login API: User cookie set"
- Verify no errors in API route

### If Cookie Sent But 401 Response:
- JWT verification issue
- Check NEXTAUTH_SECRET matches
- Check token expiration
- Check user exists in database

### If Everything Looks Good But Still Fails:
- Try NextAuth.js library instead
- Try session storage approach
- Try server-side sessions with Redis

## Files to Review

- `components/auth-provider.tsx` - Auth state management
- `app/login/page.tsx` - Login form
- `app/api/auth/login/route.ts` - Login API (sets cookie)
- `app/api/auth/me/route.ts` - Auth check API (reads cookie)
- `.env.local` - Environment variables

## Contact Points

If you're stuck, check:
1. Console logs (browser DevTools)
2. Network tab (browser DevTools)
3. Application → Cookies (browser DevTools)
4. Terminal logs (server output)

All the logging is now in place - the console will tell you exactly where the flow breaks!
