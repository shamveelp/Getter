import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { IBooking, BookingModel } from "../models/booking.model";
import { IBookingRepository } from "../core/interfaces/repositories/IBooking.repository";

@injectable()
export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {
    constructor() {
        super(BookingModel);
    }

    async findUserBookings(userId: string): Promise<IBooking[]> {
        return this._model.find({ user: userId }).populate('service').sort({ createdAt: -1 }).exec();
    }

    async findAllBookings(): Promise<IBooking[]> {
        return this._model.find({}).populate('user').populate('service').sort({ createdAt: -1 }).exec();
    }

    async findOverlappingBookings(serviceId: string, startDate: Date, endDate: Date): Promise<IBooking[]> {
        return this._model.find({
            service: serviceId,
            status: { $in: ['pending', 'confirmed', 'completed'] }, // Ignore cancelled
            $or: [
                {
                    startDate: { $lt: endDate },
                    endDate: { $gt: startDate }
                }
            ]
        }).exec();
    }
}
