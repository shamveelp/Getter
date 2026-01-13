import axiosInstance from '../../lib/axios';

const API_URL = '/api/admin/services';

export const adminServiceService = {
    getAllServices: async (page: number = 1, limit: number = 10, search: string = '', filters: any = {}) => {
        let query = `${API_URL}?page=${page}&limit=${limit}&keyword=${search}`;
        if (filters.category) query += `&category=${filters.category}`;
        if (filters.minPrice) query += `&minPrice=${filters.minPrice}`;
        if (filters.maxPrice) query += `&maxPrice=${filters.maxPrice}`;
        if (filters.location) query += `&location=${filters.location}`;
        if (filters.sort) query += `&sort=${filters.sort}`;

        const response = await axiosInstance.get(query);
        return response.data;
    },

    getServiceById: async (id: string) => {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
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
