import axiosInstance from '../../lib/axios';

const API_URL = '/api/admin/events';

export const adminEventService = {
    getAllEvents: async (page: number = 1, limit: number = 10, search: string = '') => {
        const response = await axiosInstance.get(`${API_URL}?page=${page}&limit=${limit}&keyword=${search}`);
        return response.data;
    },

    getEventById: async (id: string) => {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    },

    createEvent: async (data: any) => {
        const response = await axiosInstance.post(API_URL, data);
        return response.data;
    },

    updateEvent: async (id: string, data: any) => {
        const response = await axiosInstance.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    endEvent: async (id: string) => {
        const response = await axiosInstance.post(`${API_URL}/${id}/end`);
        return response.data;
    },

    // Optional: unlist/delete if supported by backend
};
