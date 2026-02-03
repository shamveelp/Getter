import { injectable, inject } from "inversify";
import { TYPES } from "../core/types";
import { IBookingRepository } from "../core/interfaces/repositories/IBooking.repository";
import { IServiceRepository } from "../core/interfaces/repositories/IService.repository";

import { IBooking } from "../models/booking.model";
import { BookingStatus, ServiceStatus } from "../enums/business.enums";

// Assuming IEmailService exists and has sendEmail method
import { IEmailService } from "../core/interfaces/services/IEmail.service";
import { IUserAuthRepository } from "../core/interfaces/repositories/user/IUserAuth.repository";
import { format } from "date-fns";

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

        // 1. Precise Date Normalization (Force UTC for logic consistency)
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(endDate || startDate);
        end.setUTCHours(23, 59, 59, 999);

        const now = new Date();
        now.setUTCHours(0, 0, 0, 0);

        if (start < now) {
            throw new Error("Cannot book in the past");
        }

        // 2. Check Service Availability Config
        if (service.availability.type === 'recurring' && service.availability.recurring) {
            const requestedWeekDays = this.getWeekDaysInRange(start, end);
            const allowedWeekDays = service.availability.recurring.days.map(d => d.toLowerCase());
            const missingDays = requestedWeekDays.filter(day => !allowedWeekDays.includes(day));
            if (missingDays.length > 0) {
                throw new Error(`Service is closed on: ${missingDays.join(', ')}`);
            }
        } else if (service.availability.type === 'specific_dates' && service.availability.specificDates) {
            const checkDate = new Date(start);
            while (checkDate <= end) {
                const isWithinRange = service.availability.specificDates.some(range => {
                    if (!range.startDate || !range.endDate) return false;
                    const rStart = new Date(range.startDate);
                    rStart.setUTCHours(0, 0, 0, 0);
                    const rEnd = new Date(range.endDate);
                    rEnd.setUTCHours(23, 59, 59, 999);
                    return checkDate >= rStart && checkDate <= rEnd;
                });
                if (!isWithinRange) {
                    throw new Error(`Service is not operating on ${format(checkDate, 'yyyy-MM-dd')}`);
                }
                checkDate.setUTCDate(checkDate.getUTCDate() + 1);
            }
        }

        // 3. Strict Occupancy Verification (Day-by-Day)
        const overlappingBookings = await this.bookingRepository.findOverlappingBookings(serviceId, start, end);

        const iterDate = new Date(start);
        while (iterDate <= end) {
            const dayS = new Date(iterDate);
            dayS.setUTCHours(0, 0, 0, 0);
            const dayE = new Date(iterDate);
            dayE.setUTCHours(23, 59, 59, 999);

            const occupiedCount = overlappingBookings.filter(b => {
                if (!b.startDate || !b.endDate) return false;
                const bS = new Date(b.startDate);
                const bE = new Date(b.endDate);
                return bS <= dayE && bE >= dayS;
            }).length;

            if (occupiedCount >= service.totalUnits) {
                throw new Error(`Sold out! All slots are booked for ${format(iterDate, 'MMM dd')}`);
            }
            iterDate.setUTCDate(iterDate.getUTCDate() + 1);
        }

        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        const totalPrice = service.pricePerDay * diffDays;

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

    private getWeekDaysInRange(start: Date, end: Date): string[] {
        const daysRequested = [];
        const current = new Date(start);
        const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        while (current <= end) {
            daysRequested.push(weekdays[current.getUTCDay()]);
            current.setUTCDate(current.getUTCDate() + 1);
            if (daysRequested.length > 400) break;
        }
        return Array.from(new Set(daysRequested));
    }

    async getUserBookings(userId: string): Promise<IBooking[]> {
        return this.bookingRepository.findUserBookings(userId);
    }

    async getServiceAvailability(serviceId: string, month: number, year: number): Promise<{ date: string, occupied: number, total: number }[]> {
        const service = await this.serviceRepository.findById(serviceId);
        if (!service) throw new Error("Service not found");

        const totalUnits = service.totalUnits || 1;

        // Month Boundaries in UTC
        const monthStart = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
        const monthEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

        const bookings = await this.bookingRepository.findOverlappingBookings(serviceId, monthStart, monthEnd);

        const result = [];
        const cursor = new Date(monthStart);

        while (cursor <= monthEnd) {
            const dayS = new Date(cursor);
            dayS.setUTCHours(0, 0, 0, 0);
            const dayE = new Date(cursor);
            dayE.setUTCHours(23, 59, 59, 999);

            const occupiedCount = bookings.filter(b => {
                if (!b.startDate || !b.endDate) return false;
                const bS = new Date(b.startDate);
                const bE = new Date(b.endDate);
                return bS <= dayE && bE >= dayS;
            }).length;

            result.push({
                date: format(cursor, 'yyyy-MM-dd'),
                occupied: occupiedCount,
                total: totalUnits
            });

            cursor.setUTCDate(cursor.getUTCDate() + 1);
        }

        return result;
    }

    async getAllBookings(): Promise<IBooking[]> {
        return this.bookingRepository.findAllBookings();
    }
}
