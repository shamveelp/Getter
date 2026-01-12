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
        return this._model.find({ user: userId }).populate('service').populate('event').sort({ createdAt: -1 }).exec();
    }
}
