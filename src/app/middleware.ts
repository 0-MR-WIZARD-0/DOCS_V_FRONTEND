import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const jwt = req.cookies.get('jwt')?.value;
  const { pathname } = req.nextUrl;

  if (jwt && pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  if (!jwt && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/admin/:path*'],
};