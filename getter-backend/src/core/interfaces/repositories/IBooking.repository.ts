import { IBaseRepository } from "./IBase.repository";
import { IBooking } from "../../../models/booking.model";

export interface IBookingRepository extends IBaseRepository<IBooking> {
    findUserBookings(userId: string): Promise<IBooking[]>;
    findAllBookings(): Promise<IBooking[]>;
    findOverlappingBookings(serviceId: string, startDate: Date, endDate: Date): Promise<IBooking[]>;
}
