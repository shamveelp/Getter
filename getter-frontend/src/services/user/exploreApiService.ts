import axiosInstance from '../../lib/axios';
import { Service, ServiceFilters } from '../../types/service';
import { ApiResponse, SearchResult } from '../../types/api';

const API_URL = '/api/users';

export const exploreApiService = {
    searchServices: async (filters: ServiceFilters = {}): Promise<ApiResponse<SearchResult<Service>>> => {
        let query = `${API_URL}/services?`;
        if (filters.keyword) query += `keyword=${filters.keyword}&`;
        if (filters.category) query += `category=${filters.category}&`;
        if (filters.minPrice) query += `minPrice=${filters.minPrice}&`;
        if (filters.maxPrice) query += `maxPrice=${filters.maxPrice}&`;
        if (filters.location) query += `location=${filters.location}&`;
        if (filters.sort) query += `sort=${filters.sort}&`;
        if (filters.page) query += `page=${filters.page}&`;
        if (filters.limit) query += `limit=${filters.limit}&`;

        const response = await axiosInstance.get<ApiResponse<SearchResult<Service>>>(query);
        return response.data;
    },

    getServiceDetail: async (id: string): Promise<ApiResponse<Service>> => {
        const response = await axiosInstance.get<ApiResponse<Service>>(`${API_URL}/services/${id}`);
        return response.data;
    }
};
