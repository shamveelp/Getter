import { Service } from "./service";
import { User } from "./user";

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
}

export interface Booking {
    _id: string;
    user: string | User;
    service?: string | Service;
    startDate?: string;
    endDate?: string;
    selectedDates?: string[];
    totalPrice: number;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
}

export interface PopulatedBooking extends Omit<Booking, 'service' | 'user'> {
    service: Service;
    user: User;
}

export interface BookingData {
    serviceId: string;
    startDate?: string | Date;
    endDate?: string | Date;
    selectedDates?: (string | Date)[];
}

export interface ServiceAvailabilitySlot {
    date: string;
    occupied: number;
    total: number;
}
