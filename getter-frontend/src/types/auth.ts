import { User } from "./user";
import { BaseResponse } from "./api";

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    isInitialized: boolean;
}

export interface GoogleLoginPayload {
    token?: string;
    code?: string;
    referralCode?: string;
}

export interface LoginResponse extends BaseResponse {
    user: User;
    token?: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password?: string;
    name?: string;
    referralCode?: string;
}

export interface LoginCredentials {
    email: string;
    password?: string;
}

export interface VerifyOtpPayload extends RegisterPayload {
    otp: string;
}

export interface ForgotPasswordOtpPayload {
    email: string;
    otp: string;
}

export interface ResetPasswordPayload {
    email: string;
    newPassword?: string;
}
