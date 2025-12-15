import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('jwt')?.value || null;

  if (!token && req.url.includes('/admin')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Подключаем прокси только к путям /admin
};
