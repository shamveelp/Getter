import { injectable, inject } from "inversify";
import { TYPES } from "../core/types";
import { IBookingRepository } from "../core/interfaces/repositories/IBooking.repository";
import { IServiceRepository } from "../core/interfaces/repositories/IService.repository";
import { IEventRepository } from "../core/interfaces/repositories/IEvent.repository";
import { IBooking } from "../models/booking.model";
import { BookingStatus, ServiceStatus, EventStatus } from "../enums/business.enums";

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
        @inject(TYPES.IEventRepository) private eventRepository: IEventRepository,
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
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        if (days <= 0) throw new Error("Invalid dates");

        // Check availability (Naive check: is the service explicitly available in this range? AND is it not booked?)
        // For MVP, just calculate price.
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

    async createEventBooking(userId: string, eventId: string): Promise<IBooking> {
        const event = await this.eventRepository.findById(eventId);
        if (!event || event.status !== EventStatus.UPCOMING || event.isDeleted) {
            throw new Error("Event not bookable");
        }

        const booking = await this.bookingRepository.create({
            user: userId as any,
            event: eventId as any,
            totalPrice: event.price,
            status: BookingStatus.CONFIRMED // Instant confirm for events usually?
        });

        const user = await this.userRepository.findById(userId);
        if (user) {
            await this.emailService.sendBookingConfirmation(user.email, {
                totalPrice: event.price,
                status: BookingStatus.CONFIRMED,
                type: 'Event Booking',
                title: event.title
            });
        }

        return booking;
    }

    async getUserBookings(userId: string): Promise<IBooking[]> {
        return this.bookingRepository.findUserBookings(userId);
    }

    async getAllBookings(): Promise<IBooking[]> {
        return this.bookingRepository.find({}, { sort: { createdAt: -1 } });
    }
}
