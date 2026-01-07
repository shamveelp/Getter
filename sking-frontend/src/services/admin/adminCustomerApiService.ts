import axiosInstance from '../../lib/axios';

const API_URL = '/api/admin/customers'; // Assuming backend route is mounted here

export const adminCustomerService = {
    getAllUsers: async (page: number = 1, limit: number = 10) => {
        const response = await axiosInstance.get(`${API_URL}?page=${page}&limit=${limit}`);
        return response.data;
    },

    getUserById: async (id: string) => {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    },

    banUser: async (id: string) => {
        const response = await axiosInstance.post(`${API_URL}/${id}/ban`);
        return response.data;
    },

    unbanUser: async (id: string) => {
        const response = await axiosInstance.post(`${API_URL}/${id}/unban`);
        return response.data;
    },
};
