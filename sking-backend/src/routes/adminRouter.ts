import { Router } from "express";
import adminAuthRoutes from "./adminRoutes/adminAuth.routes";

const adminRouter = Router();

adminRouter.use("/auth", adminAuthRoutes);

export default adminRouter;
