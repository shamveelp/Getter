import axiosInstance from '../../lib/axios';
import { PopulatedBooking } from '../../types/booking';
import { ApiResponse } from '../../types/api';

const API_URL = '/api/admin/bookings';

export const adminBookingApiService = {
    getAllBookings: async (): Promise<ApiResponse<PopulatedBooking[]>> => {
        const response = await axiosInstance.get<ApiResponse<PopulatedBooking[]>>(API_URL);
        return response.data;
    }
};
