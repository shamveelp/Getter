import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAuthService } from '../../services/admin/adminAuthApiService';

interface AdminUser {
    _id: string;
    username: string;
    email: string;
    name: string;
    isAdmin: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface AdminAuthState {
    user: AdminUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    isInitialized: boolean;
}

const initialState: AdminAuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isInitialized: false,
};

export const checkAdminSession = createAsyncThunk(
    'adminAuth/checkSession',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminAuthService.getMe();
            return response;
        } catch (error: any) {
            return rejectWithValue("Session invalid");
        }
    }
);

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        adminLoginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        adminLoginSuccess: (state, action: PayloadAction<{ user: AdminUser }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.error = null;
            state.isInitialized = true;
        },
        adminLoginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
            state.isInitialized = true;
        },
        adminLogout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.loading = false;
            state.isInitialized = true;
        },
        setAdminInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },
        clearAdminError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAdminSession.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAdminSession.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.isInitialized = true;
            })
            .addCase(checkAdminSession.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.isInitialized = true;
            });
    }
});

export const {
    adminLoginStart,
    adminLoginSuccess,
    adminLoginFailure,
    adminLogout,
    setAdminInitialized,
    clearAdminError
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
