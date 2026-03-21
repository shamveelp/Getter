import axiosInstance from '../../lib/axios';
import { User } from '../../types/user';
import { ApiResponse } from '../../types/api';

const API_URL = '/api/admin/customers';

export const adminCustomerService = {
    getAllUsers: async (page: number = 1, limit: number = 10, search: string = ''): Promise<ApiResponse<{ users: User[], total: number }>> => {
        const response = await axiosInstance.get<ApiResponse<{ users: User[], total: number }>>(`${API_URL}?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
    },

    getUserById: async (id: string): Promise<ApiResponse<{ user: User }>> => {
        const response = await axiosInstance.get<ApiResponse<{ user: User }>>(`${API_URL}/${id}`);
        return response.data;
    },

    banUser: async (id: string): Promise<ApiResponse<User>> => {
        const response = await axiosInstance.post<ApiResponse<User>>(`${API_URL}/${id}/ban`);
        return response.data;
    },

    unbanUser: async (id: string): Promise<ApiResponse<User>> => {
        const response = await axiosInstance.post<ApiResponse<User>>(`${API_URL}/${id}/unban`);
        return response.data;
    },
};
