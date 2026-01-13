import { Router } from "express";
import adminAuthRoutes from "./adminRoutes/adminAuth.routes";
import customerRouter from "./adminRoutes/adminCustomer.routes";
import adminServiceRouter from "./adminRoutes/adminService.routes";
import adminBookingRouter from "./adminRoutes/adminBooking.routes";
import uploadRouter from "./adminRoutes/adminUpload.routes";

const adminRouter = Router();

adminRouter.use("/auth", adminAuthRoutes);
adminRouter.use("/customers", customerRouter);
adminRouter.use("/services", adminServiceRouter);
adminRouter.use("/bookings", adminBookingRouter);
adminRouter.use("/upload", uploadRouter);

export default adminRouter;
