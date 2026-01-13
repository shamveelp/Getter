import axiosInstance from '../../lib/axios';

const API_URL = '/api/explore';

export const exploreApiService = {
    searchServices: async (filters: any = {}) => {
        let query = `${API_URL}/services?`;
        if (filters.keyword) query += `keyword=${filters.keyword}&`;
        if (filters.category) query += `category=${filters.category}&`;
        if (filters.minPrice) query += `minPrice=${filters.minPrice}&`;
        if (filters.maxPrice) query += `maxPrice=${filters.maxPrice}&`;
        if (filters.location) query += `location=${filters.location}&`;
        if (filters.sort) query += `sort=${filters.sort}&`;
        if (filters.page) query += `page=${filters.page}&`;
        if (filters.limit) query += `limit=${filters.limit}&`;

        const response = await axiosInstance.get(query);
        return response.data;
    },

    getServiceDetail: async (id: string) => {
        const response = await axiosInstance.get(`${API_URL}/services/${id}`);
        return response.data;
    }
};
