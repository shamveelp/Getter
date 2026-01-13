import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { BookingService } from "../../services/booking.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";

@injectable()
export class AdminBookingController {
    constructor(
        @inject(TYPES.IBookingService) private _bookingService: BookingService
    ) { }

    getAllBookings = async (req: Request, res: Response) => {
        try {
            const bookings = await this._bookingService.getAllBookings();
            res.status(StatusCode.OK).json({ success: true, data: bookings });
        } catch (error) {
            logger.error("Error fetching all bookings:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: (error as Error).message });
        }
    };
}
