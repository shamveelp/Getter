import axiosInstance from '../../lib/axios';

const API_URL = '/api/users/bookings';

export const bookingApiService = {
    createBooking: async (data: { serviceId: string; startDate: Date; endDate: Date }) => {
        const response = await axiosInstance.post(`${API_URL}/service`, data, { skipAuthRedirect: true } as any);
        return response.data;
    },

    getMyBookings: async () => {
        const response = await axiosInstance.get(`${API_URL}/my-bookings`);
        return response.data;
    }
};
