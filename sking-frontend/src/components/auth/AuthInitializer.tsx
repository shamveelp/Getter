'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { checkSession } from '../../redux/features/authSlice';

export default function AuthInitializer() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(checkSession());
    }, [dispatch]);

    return null;
}
