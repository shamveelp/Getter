import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { userAuthService } from '../../services/user/userAuthApiService';

interface User {
    _id: string;
    username: string;
    email: string;
    name: string;
    bio?: string;
    phoneNumber?: string;
    profilePicture?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    isInitialized: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isInitialized: false,
};

export const checkSession = createAsyncThunk(
    'auth/checkSession',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userAuthService.getMe();
            return response;
        } catch (error: any) {
            return rejectWithValue("Session invalid");
        }
    }
);

export const googleLogin = createAsyncThunk(
    'auth/googleLogin',
    async (data: { token?: string; code?: string; referralCode?: string }, { rejectWithValue }) => {
        try {
            const response = await userAuthService.googleLogin(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Google login failed");
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{ user: User }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.error = null;
            state.isInitialized = true;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
            state.isInitialized = true;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.loading = false;
            state.isInitialized = true;
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
    extraReducers: (builder) => {
        builder
            .addCase(checkSession.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkSession.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.isInitialized = true;
            })
            .addCase(checkSession.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.isInitialized = true;
            })
            .addCase(googleLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.isInitialized = true;
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isInitialized = true;
            });
    }
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