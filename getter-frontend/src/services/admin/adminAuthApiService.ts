import axiosInstance from '../../lib/axios';
import { 
    LoginCredentials, 
    ForgotPasswordOtpPayload, 
    ResetPasswordPayload, 
    LoginResponse 
} from '../../types/auth';
import { BaseResponse } from '../../types/api';
import { User } from '../../types/user';

const API_URL = '/api/admin/auth';

export const adminAuthService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await axiosInstance.post<LoginResponse>(`${API_URL}/login`, credentials);
        return response.data;
    },

    verifyForgotPasswordOtp: async (data: ForgotPasswordOtpPayload): Promise<BaseResponse> => {
        const response = await axiosInstance.post<BaseResponse>(`${API_URL}/verify-forgot-otp`, data);
        return response.data;
    },

    forgotPassword: async (email: string): Promise<BaseResponse> => {
        const response = await axiosInstance.post<BaseResponse>(`${API_URL}/forgot-password`, { email });
        return response.data;
    },

    resetPassword: async (data: ResetPasswordPayload): Promise<BaseResponse> => {
        const response = await axiosInstance.post<BaseResponse>(`${API_URL}/reset-password`, data);
        return response.data;
    },

    getMe: async (): Promise<BaseResponse & { user: User }> => {
        const response = await axiosInstance.get<BaseResponse & { user: User }>(`${API_URL}/me`);
        return response.data;
    },

    refreshToken: async (): Promise<BaseResponse & { user: User }> => {
        const response = await axiosInstance.post<BaseResponse & { user: User }>(`${API_URL}/refresh-token`);
        return response.data;
    },

    logout: async (): Promise<BaseResponse> => {
        const response = await axiosInstance.post<BaseResponse>(`${API_URL}/logout`);
        return response.data;
    },
};
