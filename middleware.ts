import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if user has a refresh token cookie (indicates they're authenticated)
  const refreshToken = request.cookies.get('refresh_token');
  const isAuthenticated = !!refreshToken;

  // If user is authenticated and trying to access the landing page, redirect to dashboard
  if (isAuthenticated && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Only run middleware on the landing page
export const config = {
  matcher: '/',
};
