import { Router } from "express";
import adminAuthRoutes from "./adminRoutes/adminAuth.routes";
import customerRouter from "./adminRoutes/adminCustomer.routes";
import adminServiceRouter from "./adminRoutes/service.routes";
import adminEventRouter from "./adminRoutes/event.routes";
import uploadRouter from "./adminRoutes/upload.routes";

const adminRouter = Router();

adminRouter.use("/auth", adminAuthRoutes);
adminRouter.use("/customers", customerRouter);
adminRouter.use("/services", adminServiceRouter);
adminRouter.use("/events", adminEventRouter);
adminRouter.use("/upload", uploadRouter);

export default adminRouter;
