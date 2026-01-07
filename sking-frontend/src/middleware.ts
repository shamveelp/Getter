import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define routes that should strictly be accessible only to non-authenticated users
    const guestRoutes = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify-otp',
        '/verify-forgot-otp'
    ];

    const adminRoutes = [
        '/admin'
    ];

    const adminGuestRoutes = [
        '/admin/login'
    ];

    // Check if the current path is a guest route
    const isGuestRoute = guestRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    const isAdminGuestRoute = adminGuestRoutes.some(route => pathname.startsWith(route));

    // Get the token from cookies
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const isAuthenticated = !!accessToken || !!refreshToken;

    // TODO: Ideally we should decode the token to check the role, but for middleware without verifying signature (expensive),
    // we assume backend handles role verification. But we can check a client cookie for role if available, or just rely on API 403s.
    // However, to do redirects efficiently:

    // For now, let's assume if you are authenticated, you are a user. 
    // Admin checking usually requires verifying the token. 
    // Since we can't easily verify signature in Edge middleware without external libs (jwt-decode works though).
    // Let's rely on protected pages to redirect if role doesn't match, or add a 'role' cookie.

    // If user is authenticated and tries to access guest routes, redirect to home
    if (isAuthenticated && isGuestRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If user is authenticated and tries to access admin login, redirect to admin dashboard
    // NOTE: This assumes the authenticated user IS an admin. If they are a normal user, they shouldn't be here anyway.
    // We might want to separate user and admin tokens to avoid confusion or check a role cookie.
    if (isAuthenticated && isAdminGuestRoute) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (!isAuthenticated && isAdminRoute && !isAdminGuestRoute) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const response = NextResponse.next();

    // Prevent caching of auth pages to handle back-button navigation security
    if (isGuestRoute) {
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
    }

    return response;
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder content if any
         */
        '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
