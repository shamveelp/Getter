import { injectable, inject } from "inversify";
import { TYPES } from "../core/types";
import { IBookingRepository } from "../core/interfaces/repositories/IBooking.repository";
import { IServiceRepository } from "../core/interfaces/repositories/IService.repository";

import { IBooking } from "../models/booking.model";
import { BookingStatus, ServiceStatus } from "../enums/business.enums";

// Assuming IEmailService exists and has sendEmail method
// I'll define a dummy interface here if I can't find the real one easily, or ignore injection for now if not strictly required to run, but requirement says "Send emails".
// I saw "email.service.ts" in `src/services/email.service.ts`, so I should probably inject it.
import { IEmailService } from "../core/interfaces/services/IEmail.service";
import { IUserAuthRepository } from "../core/interfaces/repositories/user/IUserAuth.repository";

@injectable()
export class BookingService {
    constructor(
        @inject(TYPES.IBookingRepository) private bookingRepository: IBookingRepository,
        @inject(TYPES.IServiceRepository) private serviceRepository: IServiceRepository,

        @inject(TYPES.IEmailService) private emailService: IEmailService,
        @inject(TYPES.IUserAuthRepository) private userRepository: IUserAuthRepository
    ) { }

    async createServiceBooking(userId: string, serviceId: string, startDate: Date, endDate: Date): Promise<IBooking> {
        const service = await this.serviceRepository.findById(serviceId);
        if (!service || service.status !== ServiceStatus.ACTIVE || service.isDeleted) {
            throw new Error("Service not available");
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start < new Date()) {
            throw new Error("Cannot book in the past");
        }

        const diffTime = end.getTime() - start.getTime();
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // At least 1 day

        if (diffTime < 0) throw new Error("End date must be after start date");

        // 1. Check Recurring Days Availability
        if (service.availability.type === 'recurring' && service.availability.recurring) {
            const requestedDays = this.getDaysInRange(start, end);
            const availableDays = service.availability.recurring.days;
            const unavailableRequestedDays = requestedDays.filter(day => !availableDays.includes(day));
            if (unavailableRequestedDays.length > 0) {
                throw new Error(`Service is not available on: ${unavailableRequestedDays.join(', ')}`);
            }
        }

        // 2. Check Unit Availability (Overlap)
        const overlapping = await this.bookingRepository.findOverlappingBookings(serviceId, start, end);
        const maxOccupied = this.calculateMaxOverlappingUnits(start, end, overlapping);

        if (maxOccupied >= service.totalUnits) {
            throw new Error("Sold out! No available units/slots for the selected dates.");
        }

        const totalPrice = service.pricePerDay * days;

        const booking = await this.bookingRepository.create({
            user: userId as any,
            service: serviceId as any,
            startDate: start,
            endDate: end,
            totalPrice,
            status: BookingStatus.PENDING
        });

        const user = await this.userRepository.findById(userId);
        if (user) {
            await this.emailService.sendBookingConfirmation(user.email, {
                totalPrice,
                status: BookingStatus.PENDING,
                type: 'Service Booking',
                title: service.title
            });
        }
        return booking;
    }

    private getDaysInRange(start: Date, end: Date): string[] {
        const days = [];
        const current = new Date(start);
        const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        while (current <= end) {
            days.push(weekdays[current.getDay()]);
            current.setDate(current.getDate() + 1);
            if (days.length > 31) break; // Safety break
        }
        return Array.from(new Set(days));
    }

    private calculateMaxOverlappingUnits(start: Date, end: Date, overlapping: IBooking[]): number {
        if (overlapping.length === 0) return 0;

        // Collect all critical time points (starts and ends)
        const points: { time: number; type: number }[] = [];
        overlapping.forEach(b => {
            if (b.startDate) points.push({ time: new Date(b.startDate).getTime(), type: 1 }); // Start
            if (b.endDate) points.push({ time: new Date(b.endDate).getTime(), type: -1 }); // End
        });

        // Sort points by time
        points.sort((a, b) => a.time - b.time || a.type);

        let max = 0;
        let current = 0;
        for (const p of points) {
            current += p.type;
            if (current > max) max = current;
        }

        return max;
    }



    async getUserBookings(userId: string): Promise<IBooking[]> {
        return this.bookingRepository.findUserBookings(userId);
    }

    async getServiceAvailability(serviceId: string, month: number, year: number): Promise<{ date: string, occupied: number, total: number }[]> {
        const service = await this.serviceRepository.findById(serviceId);
        if (!service) throw new Error("Service not found");

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59); // End of month

        const bookings = await this.bookingRepository.findOverlappingBookings(serviceId, startDate, endDate);

        const availability = [];
        const current = new Date(startDate);
        while (current <= endDate) {
            const dateStr = current.toISOString().split('T')[0];
            const dayStart = new Date(current);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(current);
            dayEnd.setHours(23, 59, 59, 999);

            // Calculate max overlap for THIS specific day
            const occupied = this.calculateMaxOverlappingUnits(dayStart, dayEnd, bookings);

            availability.push({
                date: dateStr,
                occupied,
                total: service.totalUnits
            });
            current.setDate(current.getDate() + 1);
        }

        return availability;
    }

    async getAllBookings(): Promise<IBooking[]> {
        return this.bookingRepository.findAllBookings();
    }
}
