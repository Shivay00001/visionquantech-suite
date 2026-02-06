import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Protected routes
    const protectedPaths = ['/dashboard', '/crm', '/hr', '/finance', '/inventory', '/admin', '/superadmin'];
    const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

    // Auth routes
    const isAuthPath = req.nextUrl.pathname.startsWith('/auth');

    // Redirect logic
    if (isProtectedPath && !session) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (isAuthPath && session) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
