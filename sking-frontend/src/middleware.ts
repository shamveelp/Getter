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

    // Check if the current path is a guest route
    const isGuestRoute = guestRoutes.some(route => pathname.startsWith(route));

    // Get the token from cookies
    // We check for refreshToken usually as it has longer validity, 
    // ensuring we catch users who might have an expired access token but valid session.
    // However, checking accessToken is also fine if we expect it to be present.
    // Let's check for either to be safe that a session exists.
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const isAuthenticated = !!accessToken || !!refreshToken;

    // If user is authenticated and tries to access guest routes, redirect to home
    if (isAuthenticated && isGuestRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
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
