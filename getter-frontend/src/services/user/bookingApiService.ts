import axiosInstance from '../../lib/axios';
import { Booking, BookingData, ServiceAvailabilitySlot } from '../../types/booking';
import { ApiResponse } from '../../types/api';

const API_URL = '/api/users/bookings';

export const bookingApiService = {
    createBooking: async (data: BookingData): Promise<ApiResponse<Booking>> => {
        const response = await axiosInstance.post<ApiResponse<Booking>>(`${API_URL}/service`, data, { skipAuthRedirect: true });
        return response.data;
    },

    getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
        const response = await axiosInstance.get<ApiResponse<Booking[]>>(`${API_URL}/my-bookings`);
        return response.data;
    },

    getServiceAvailability: async (serviceId: string, month: number, year: number): Promise<ApiResponse<ServiceAvailabilitySlot[]>> => {
        const response = await axiosInstance.get<ApiResponse<ServiceAvailabilitySlot[]>>(`${API_URL}/service/${serviceId}/availability?month=${month}&year=${year}`);
        return response.data;
    }
};
