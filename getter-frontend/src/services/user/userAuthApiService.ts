import axiosInstance from '../../lib/axios';
import { 
    LoginCredentials, 
    RegisterPayload, 
    VerifyOtpPayload, 
    ForgotPasswordOtpPayload, 
    ResetPasswordPayload, 
    GoogleLoginPayload, 
    LoginResponse 
} from '../../types/auth';
import { BaseResponse } from '../../types/api';
import { User } from '../../types/user';

const API_URL = '/api/users/auth';

export const userAuthService = {
    register: async (userData: RegisterPayload): Promise<BaseResponse> => {
        const response = await axiosInstance.post<BaseResponse>(`${API_URL}/register`, userData);
        return response.data;
    },

    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await axiosInstance.post<LoginResponse>(`${API_URL}/login`, credentials);
        return response.data;
    },

    verifyOtp: async (data: VerifyOtpPayload): Promise<LoginResponse> => {
        const response = await axiosInstance.post<LoginResponse>(`${API_URL}/verify-otp`, data);
        return response.data;
    },

    resendOtp: async (email: string): Promise<BaseResponse> => {
        const response = await axiosInstance.post<BaseResponse>(`${API_URL}/resend-otp`, { email });
        return response.data;
    },

    checkUsername: async (username: string): Promise<BaseResponse & { isAvailable: boolean }> => {
        const response = await axiosInstance.post<BaseResponse & { isAvailable: boolean }>(`${API_URL}/check-username`, { username });
        return response.data;
    },

    checkEmail: async (email: string): Promise<BaseResponse & { isAvailable: boolean }> => {
        const response = await axiosInstance.post<BaseResponse & { isAvailable: boolean }>(`${API_URL}/check-email`, { email });
        return response.data;
    },

    generateUsername: async (email?: string): Promise<BaseResponse & { username: string }> => {
        const url = email ? `${API_URL}/generate-username?email=${encodeURIComponent(email)}` : `${API_URL}/generate-username`;
        const response = await axiosInstance.get<BaseResponse & { username: string }>(url);
        return response.data;
    },

    forgotPassword: async (email: string): Promise<BaseResponse> => {
        const response = await axiosInstance.post<BaseResponse>(`${API_URL}/forgot-password`, { email });
        return response.data;
    },

    verifyForgotPasswordOtp: async (data: ForgotPasswordOtpPayload): Promise<BaseResponse> => {
        const response = await axiosInstance.post<BaseResponse>(`${API_URL}/verify-forgot-otp`, data);
        return response.data;
    },

    resetPassword: async (data: ResetPasswordPayload): Promise<BaseResponse> => {
        const response = await axiosInstance.post<BaseResponse>(`${API_URL}/reset-password`, data);
        return response.data;
    },

    googleLogin: async (data: GoogleLoginPayload): Promise<LoginResponse> => {
        const response = await axiosInstance.post<LoginResponse>(`${API_URL}/google-login`, data);
        return response.data;
    },

    getMe: async (): Promise<BaseResponse & { user: User }> => {
        const response = await axiosInstance.get<BaseResponse & { user: User }>(`${API_URL}/me`);
        return response.data;
    },

    refreshToken: async (): Promise<BaseResponse> => {
        const response = await axiosInstance.post<BaseResponse>(`${API_URL}/refresh-token`);
        return response.data;
    },

    logout: async (): Promise<BaseResponse> => {
        const response = await axiosInstance.post<BaseResponse>(`${API_URL}/logout`);
        return response.data;
    },

    logoutAll: async (): Promise<BaseResponse> => {
        const response = await axiosInstance.post<BaseResponse>(`${API_URL}/logout-all`);
        return response.data;
    },
};