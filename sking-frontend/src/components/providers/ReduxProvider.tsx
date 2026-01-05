'use client';

import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { setupInterceptors } from '../../lib/axios';
import { logout } from '../../redux/features/authSlice';

import AuthInitializer from '../auth/AuthInitializer';

// Initialize axios interceptors
setupInterceptors(store, logout);

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthInitializer />
            {children}
        </Provider>
    );
}
