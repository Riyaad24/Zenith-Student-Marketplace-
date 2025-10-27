import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return handleAdminRoute(request)
  }

  return NextResponse.next()
}

async function handleAdminRoute(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
               request.cookies.get('auth-token')?.value

  if (!token) {
    return redirectToLogin(request)
  }

  try {
    // For Edge runtime, we'll do a simpler token check
    // The actual JWT verification will happen in the API routes
    
    // Just check if token exists and looks like a JWT (has 3 parts)
    const tokenParts = token.split('.')
    if (tokenParts.length !== 3) {
      return redirectToLogin(request)
    }

    // For admin dashboard pages, allow access (verification happens client-side)
    // For API routes, they have their own JWT verification
    return NextResponse.next()
  } catch (error) {
    console.error('Admin middleware error:', error)
    return redirectToLogin(request)
  }
}

function isAdminEmail(email: string): boolean {
  const adminEmailPattern = /^[0-9]{9}ads@my\.richfield\.ac\.za$/
  return adminEmailPattern.test(email)
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    // Temporarily disable admin middleware to allow client-side auth
    // '/admin/:path*'
  ]
}