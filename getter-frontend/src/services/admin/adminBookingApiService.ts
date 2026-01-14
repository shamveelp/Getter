import axiosInstance from '../../lib/axios';

const API_URL = '/api/admin/bookings';

export const adminBookingApiService = {
    getAllBookings: async () => {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    }
};
