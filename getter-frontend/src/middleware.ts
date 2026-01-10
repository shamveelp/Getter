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
    const userRole = request.cookies.get('user_role')?.value;
    const isAuthenticated = !!accessToken || !!refreshToken;

    // If user is authenticated and tries to access guest routes (login/register), redirect based on role
    if (isAuthenticated && isGuestRoute) {
        if (userRole === 'admin') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If user is authenticated and tries to access admin login
    if (isAuthenticated && isAdminGuestRoute) {
        if (userRole === 'admin') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Protected Admin Routes
    if (isAdminRoute && !isAdminGuestRoute) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        if (userRole !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    const response = NextResponse.next();

    // Prevent caching of auth pages to handle back-button navigation security
    if (isGuestRoute || isAdminGuestRoute) {
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
