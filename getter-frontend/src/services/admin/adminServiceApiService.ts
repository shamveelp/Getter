import axiosInstance from '../../lib/axios';

const API_URL = '/api/admin/services';

export const adminServiceService = {
    getAllServices: async (page: number = 1, limit: number = 10, search: string = '') => {
        const response = await axiosInstance.get(`${API_URL}?page=${page}&limit=${limit}&keyword=${search}`);
        return response.data;
    },

    createService: async (data: any) => {
        const response = await axiosInstance.post(API_URL, data);
        return response.data;
    },

    updateService: async (id: string, data: any) => {
        const response = await axiosInstance.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    deleteService: async (id: string) => {
        const response = await axiosInstance.delete(`${API_URL}/${id}`);
        return response.data;
    },

    unlistService: async (id: string) => {
        const response = await axiosInstance.patch(`${API_URL}/${id}/unlist`);
        return response.data;
    }
};
