import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    _id: string;
    username: string;
    email: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    accessToken: string | null;
    isInitialized: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    accessToken: null,
    isInitialized: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.error = null;
            state.isInitialized = true;
            if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', action.payload.accessToken);
            }
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.error = action.payload;
            state.isInitialized = true;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
            }
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.accessToken = null;
            state.error = null;
            state.loading = false;
            state.isInitialized = true;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
            }
        },
        updateUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
});

export const { 
    loginStart, 
    loginSuccess, 
    loginFailure, 
    logout, 
    updateUser, 
    setInitialized, 
    clearError 
} = authSlice.actions;

export default authSlice.reducer;