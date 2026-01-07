import { Router } from "express";
import adminAuthRoutes from "./adminRoutes/adminAuth.routes";
import customerRouter from "./adminRoutes/customer.routes";

const adminRouter = Router();

adminRouter.use("/auth", adminAuthRoutes);
adminRouter.use("/customers", customerRouter);

export default adminRouter;
