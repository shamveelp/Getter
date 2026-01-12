import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { BookingController } from "../../controllers/user/booking.controller";
import { verifyToken } from "../../middlewares/auth.middleware";

const bookingRouter = Router();
const bookingController = container.get<BookingController>(TYPES.IBookingController);

bookingRouter.post("/service", verifyToken, bookingController.createServiceBooking);
bookingRouter.post("/event", verifyToken, bookingController.createEventBooking);
bookingRouter.get("/my-bookings", verifyToken, bookingController.getMyBookings);

export default bookingRouter;
