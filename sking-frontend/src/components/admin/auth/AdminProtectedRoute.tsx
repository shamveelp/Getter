'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/redux/store';
import { adminAuthService } from '@/services/admin/adminAuthApiService';
import { adminLogout } from '@/redux/features/adminAuthSlice';
import { Loader2 } from 'lucide-react';

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isInitialized, loading } = useSelector((state: RootState) => state.adminAuth);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            // checking if we need to clear cookies to avoid middleware loop
            // assuming if we are here and not authenticated, we should ensure cookies are gone
            const clearAndRedirect = async () => {
                try {
                    await adminAuthService.logout();
                    dispatch(adminLogout());
                } catch (e) {
                    // ignore error
                }
                router.push('/admin/login');
            };

            clearAndRedirect();
        }
    }, [isInitialized, isAuthenticated, router, dispatch]);

    if (loading || !isInitialized) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a]">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // or loading
    }

    return <>{children}</>;
}
