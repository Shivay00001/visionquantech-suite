import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req) {
    const res = NextResponse.next();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll: () => req.cookies.getAll(),
                setAll: (cookies) => cookies.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
            },
        }
    );

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
