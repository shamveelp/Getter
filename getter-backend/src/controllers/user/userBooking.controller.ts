import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { BookingService } from "../../services/booking.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";

@injectable()
export class BookingController {
    constructor(
        @inject(TYPES.IBookingService) private _bookingService: BookingService
    ) { }

    createServiceBooking = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id; // Correct way to access user from middleware
            const { serviceId, startDate, endDate, selectedDates } = req.body;
            const result = await this._bookingService.createServiceBooking(userId, serviceId, startDate, endDate, selectedDates);
            res.status(StatusCode.CREATED).json({ success: true, data: result });
        } catch (error) {
            logger.error("Error creating service booking:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: (error as Error).message });
        }
    };



    getMyBookings = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const result = await this._bookingService.getUserBookings(userId);
            res.status(StatusCode.OK).json({ success: true, data: result });
        } catch (error) {
            logger.error("Error fetching bookings:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: (error as Error).message });
        }
    };

    getServiceAvailability = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { month, year } = req.query;
            const result = await this._bookingService.getServiceAvailability(
                id,
                Number(month) || new Date().getMonth() + 1,
                Number(year) || new Date().getFullYear()
            );
            res.status(StatusCode.OK).json({ success: true, data: result });
        } catch (error) {
            logger.error("Error fetching availability:", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: (error as Error).message });
        }
    }
}
