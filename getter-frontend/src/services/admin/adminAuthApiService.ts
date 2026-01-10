import axiosInstance from '../../lib/axios';

const API_URL = '/api/admin/auth';

export const adminAuthService = {
    login: async (credentials: { email: string; password: string }) => {
        const response = await axiosInstance.post(`${API_URL}/login`, credentials);
        return response.data;
    },

    verifyForgotPasswordOtp: async (data: { email: string; otp: string }) => {
        const response = await axiosInstance.post(`${API_URL}/verify-forgot-otp`, data);
        return response.data;
    },

    forgotPassword: async (email: string) => {
        const response = await axiosInstance.post(`${API_URL}/forgot-password`, { email });
        return response.data;
    },

    resetPassword: async (data: { email: string; newPassword: string }) => {
        const response = await axiosInstance.post(`${API_URL}/reset-password`, data);
        return response.data;
    },

    getMe: async () => {
        const response = await axiosInstance.get(`${API_URL}/me`);
        return response.data;
    },

    refreshToken: async () => {
        const response = await axiosInstance.post(`${API_URL}/refresh-token`);
        return response.data;
    },

    logout: async () => {
        const response = await axiosInstance.post(`${API_URL}/logout`);
        return response.data;
    },
};
