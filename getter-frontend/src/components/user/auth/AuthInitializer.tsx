'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { AppDispatch } from '../../../redux/store';
import { checkSession } from '../../../redux/features/authSlice';
import { checkAdminSession } from '../../../redux/features/adminAuthSlice';

export default function AuthInitializer() {
    const dispatch = useDispatch<AppDispatch>();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname?.startsWith('/admin')) {
            dispatch(checkAdminSession());
        } else {
            dispatch(checkSession());
        }
    }, [dispatch, pathname]);

    return null;
}
