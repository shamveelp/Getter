import axiosInstance from '../../lib/axios';

const API_URL = '/api/users/auth';

export const userAuthService = {
    register: async (userData: { username: string; email: string; password: string; name?: string; referralCode?: string }) => {
        const response = await axiosInstance.post(`${API_URL}/register`, userData);
        return response.data;
    },

    login: async (credentials: { email: string; password: string }) => {
        const response = await axiosInstance.post(`${API_URL}/login`, credentials);
        return response.data;
    },

    verifyOtp: async (data: { username: string; email: string; password: string; name?: string; otp: string; referralCode?: string }) => {
        const response = await axiosInstance.post(`${API_URL}/verify-otp`, data);
        return response.data;
    },

    resendOtp: async (email: string) => {
        const response = await axiosInstance.post(`${API_URL}/resend-otp`, { email });
        return response.data;
    },

    checkUsername: async (username: string) => {
        const response = await axiosInstance.post(`${API_URL}/check-username`, { username });
        return response.data;
    },

    checkEmail: async (email: string) => {
        const response = await axiosInstance.post(`${API_URL}/check-email`, { email });
        return response.data;
    },

    generateUsername: async (email?: string) => {
        const url = email ? `${API_URL}/generate-username?email=${encodeURIComponent(email)}` : `${API_URL}/generate-username`;
        const response = await axiosInstance.get(url);
        return response.data;
    },

    forgotPassword: async (email: string) => {
        const response = await axiosInstance.post(`${API_URL}/forgot-password`, { email });
        return response.data;
    },

    verifyForgotPasswordOtp: async (data: { email: string; otp: string }) => {
        const response = await axiosInstance.post(`${API_URL}/verify-forgot-otp`, data);
        return response.data;
    },

    resetPassword: async (data: { email: string; newPassword: string }) => {
        const response = await axiosInstance.post(`${API_URL}/reset-password`, data);
        return response.data;
    },

    googleLogin: async (data: { token?: string; code?: string; referralCode?: string }) => {
        const response = await axiosInstance.post(`${API_URL}/google-login`, data);
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

    logoutAll: async () => {
        const response = await axiosInstance.post(`${API_URL}/logout-all`);
        return response.data;
    },
};