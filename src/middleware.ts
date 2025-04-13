import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function middleware(request: Request) {
  const session = await getSession();
  const isAuth = !!session;
  const isAuthPage = request.url.includes('/login') || request.url.includes('/register');
  const isAdminPage = request.url.includes('/admin');

  // Redirect authenticated users away from auth pages
  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect admin and dashboard routes
  if (!isAuth && (isAdminPage || request.url.includes('/dashboard'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/admin/:path*']
}; 