import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/session';

// ─── Protected route prefixes ───────────────────────────────────────────────
// Any path that starts with these requires a valid session.
const PROTECTED_PREFIXES = ['/dashboard', '/projects', '/team'];
const AUTH_ROUTES = ['/login'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isHomepage = pathname === '/';

  const session = await getSessionFromRequest(request);

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages AND homepage
  if ((isAuthRoute || isHomepage) && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
