import axiosInstance from '../../lib/axios';
import { Service, ServiceFilters, ServiceStatus } from '../../types/service';
import { ApiResponse, SearchResult } from '../../types/api';

const API_URL = '/api/admin/services';

export const adminServiceService = {
    getAllServices: async (page: number = 1, limit: number = 10, search: string = '', filters: ServiceFilters = {}): Promise<ApiResponse<SearchResult<Service>>> => {
        let query = `${API_URL}?page=${page}&limit=${limit}&keyword=${search}`;
        if (filters.category) query += `&category=${filters.category}`;
        if (filters.minPrice) query += `&minPrice=${filters.minPrice}`;
        if (filters.maxPrice) query += `&maxPrice=${filters.maxPrice}`;
        if (filters.location) query += `&location=${filters.location}`;
        if (filters.sort) query += `&sort=${filters.sort}`;
        if (filters.status) query += `&status=${filters.status}`;

        const response = await axiosInstance.get<ApiResponse<SearchResult<Service>>>(query);
        return response.data;
    },

    getServiceById: async (id: string): Promise<ApiResponse<Service>> => {
        const response = await axiosInstance.get<ApiResponse<Service>>(`${API_URL}/${id}`);
        return response.data;
    },

    createService: async (data: Partial<Service>): Promise<ApiResponse<Service>> => {
        const response = await axiosInstance.post<ApiResponse<Service>>(API_URL, data);
        return response.data;
    },

    updateService: async (id: string, data: Partial<Service>): Promise<ApiResponse<Service>> => {
        const response = await axiosInstance.put<ApiResponse<Service>>(`${API_URL}/${id}`, data);
        return response.data;
    },

    deleteService: async (id: string): Promise<ApiResponse<null>> => {
        const response = await axiosInstance.delete<ApiResponse<null>>(`${API_URL}/${id}`);
        return response.data;
    },

    unlistService: async (id: string): Promise<ApiResponse<Service>> => {
        const response = await axiosInstance.patch<ApiResponse<Service>>(`${API_URL}/${id}/unlist`);
        return response.data;
    },

    listService: async (id: string): Promise<ApiResponse<Service>> => {
        const response = await axiosInstance.patch<ApiResponse<Service>>(`${API_URL}/${id}/list`);
        return response.data;
    }
};
