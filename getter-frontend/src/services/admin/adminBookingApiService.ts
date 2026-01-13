import axiosInstance from '../../lib/axios';

const API_URL = '/api/admin/bookings';

export const adminBookingService = {
    getAllBookings: async () => {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    }
};
