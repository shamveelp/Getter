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

    async createServiceBooking(userId: string, serviceId: string, startDate?: Date, endDate?: Date, selectedDates?: Date[]): Promise<IBooking> {
        const service = await this.serviceRepository.findById(serviceId);
        if (!service || service.status !== ServiceStatus.ACTIVE || service.isDeleted) {
            throw new Error("Service not available");
        }

        let datesToBook: Date[] = [];

        if (selectedDates && selectedDates.length > 0) {
            // Use discrete dates
            datesToBook = selectedDates.map(d => {
                const date = new Date(d);
                date.setUTCHours(0, 0, 0, 0);
                return date;
            });
        } else if (startDate) {
            // Use range
            const start = new Date(startDate);
            start.setUTCHours(0, 0, 0, 0);
            const end = new Date(endDate || startDate);
            end.setUTCHours(0, 0, 0, 0);

            let current = new Date(start);
            while (current <= end) {
                datesToBook.push(new Date(current));
                current.setUTCDate(current.getUTCDate() + 1);
            }
        }

        if (datesToBook.length === 0) {
            throw new Error("No dates selected for booking");
        }

        const now = new Date();
        now.setUTCHours(0, 0, 0, 0);

        // 1. Validate dates are not in the past and follow service availability
        for (const date of datesToBook) {
            if (date < now) {
                throw new Error(`Cannot book in the past: ${format(date, 'yyyy-MM-dd')}`);
            }

            if (service.availability.type === 'recurring' && service.availability.recurring) {
                const dayName = format(date, 'eeee').toLowerCase();
                if (!service.availability.recurring.days.map(d => d.toLowerCase()).includes(dayName)) {
                    throw new Error(`Service is closed on ${format(date, 'eeee')} (${format(date, 'yyyy-MM-dd')})`);
                }
            } else if (service.availability.type === 'specific_dates' && service.availability.specificDates) {
                const isWithinRange = service.availability.specificDates.some(range => {
                    if (!range.startDate || !range.endDate) return false;
                    const rStart = new Date(range.startDate);
                    rStart.setUTCHours(0, 0, 0, 0);
                    const rEnd = new Date(range.endDate);
                    rEnd.setUTCHours(23, 59, 59, 999);
                    return date >= rStart && date <= rEnd;
                });
                if (!isWithinRange) {
                    throw new Error(`Service is not operating on ${format(date, 'yyyy-MM-dd')}`);
                }
            }
        }

        // 2. Overlap Check
        const minDate = new Date(Math.min(...datesToBook.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...datesToBook.map(d => d.getTime())));
        maxDate.setUTCHours(23, 59, 59, 999);

        const overlappingBookings = await this.bookingRepository.findOverlappingBookings(serviceId, minDate, maxDate);

        for (const date of datesToBook) {
            const dayS = new Date(date);
            dayS.setUTCHours(0, 0, 0, 0);
            const dayE = new Date(date);
            dayE.setUTCHours(23, 59, 59, 999);

            const occupiedCount = overlappingBookings.filter(b => {
                if (b.selectedDates && b.selectedDates.length > 0) {
                    return b.selectedDates.some(sd => {
                        const sDate = new Date(sd);
                        return sDate.getTime() === dayS.getTime();
                    });
                }
                if (b.startDate && b.endDate) {
                    const bS = new Date(b.startDate);
                    const bE = new Date(b.endDate);
                    return bS <= dayE && bE >= dayS;
                }
                return false;
            }).length;

            if (occupiedCount >= service.totalUnits) {
                throw new Error(`Sold out! All slots are booked for ${format(date, 'MMM dd')}`);
            }
        }

        const totalPrice = service.pricePerDay * datesToBook.length;

        const booking = await this.bookingRepository.create({
            user: userId as any,
            service: serviceId as any,
            startDate: minDate,
            endDate: maxDate,
            selectedDates: datesToBook,
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

        // Force UTC Month Boundaries
        const monthStart = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
        const monthEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

        // Get all relevant bookings
        const bookings = await this.bookingRepository.findOverlappingBookings(serviceId, monthStart, monthEnd);

        const result = [];
        let cursor = new Date(monthStart);

        while (cursor <= monthEnd) {
            const currentDayStr = cursor.toISOString().split('T')[0];

            // Define precise UTC boundaries for this specific day
            const dayS = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate(), 0, 0, 0, 0));
            const dayE = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate(), 23, 59, 59, 999));

            const occupiedCount = bookings.filter(b => {
                if (b.selectedDates && b.selectedDates.length > 0) {
                    return b.selectedDates.some(sd => {
                        const sDate = new Date(sd);
                        return sDate.getTime() === dayS.getTime();
                    });
                }
                if (b.startDate && b.endDate) {
                    const bS = new Date(b.startDate);
                    const bE = new Date(b.endDate);
                    return bS <= dayE && bE >= dayS;
                }
                return false;
            }).length;

            result.push({
                date: currentDayStr,
                occupied: occupiedCount,
                total: totalUnits
            });

            // Move to next day UTC safely
            cursor.setUTCDate(cursor.getUTCDate() + 1);
        }

        return result;
    }

    async getAllBookings(): Promise<IBooking[]> {
        return this.bookingRepository.findAllBookings();
    }
}
