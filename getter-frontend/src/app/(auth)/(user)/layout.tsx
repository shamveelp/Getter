'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../../../redux/store';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            router.replace('/');
        }
    }, [isInitialized, isAuthenticated, router]);

    if (isInitialized && isAuthenticated) {
        return null; // Don't render auth pages if redirected
    }

    return <>{children}</>;
}

