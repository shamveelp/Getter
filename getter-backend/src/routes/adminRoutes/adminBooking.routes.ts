import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { AdminBookingController } from "../../controllers/admin/adminBooking.controller";
import { verifyToken } from "../../middlewares/auth.middleware";

const adminBookingRouter = Router();
const adminBookingController = container.get<AdminBookingController>(TYPES.IAdminBookingController);

adminBookingRouter.use(verifyToken);

adminBookingRouter.get("/", adminBookingController.getAllBookings);

export default adminBookingRouter;
