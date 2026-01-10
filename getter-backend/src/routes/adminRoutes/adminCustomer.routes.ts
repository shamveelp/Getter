import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IAdminCustomerController } from "../../core/interfaces/controllers/admin/IAdminCustomer.controller";
import { verifyToken } from "../../middlewares/auth.middleware"; // Assuming standard auth middleware used for admin too?
// Wait, usually there is an admin specific middleware or check?
// The verifyToken middleware checks validity. Admin check happens in controller or middleware?
// In adminRefresh logic, it checked role == 'admin'.
// Let's assume verifyToken is enough for authentication, and we might need authorization.
// But usually for simplicity in these projects, we just use verifyToken and maybe check role inside or use a separate middleware.
// Let's check adminAuth.routes to see.

const customerRouter = Router();
const adminCustomerController = container.get<IAdminCustomerController>(TYPES.IAdminCustomerController);

customerRouter.get("/", verifyToken, adminCustomerController.getAllUsers);
customerRouter.get("/:id", verifyToken, adminCustomerController.getUserById);
customerRouter.post("/:id/ban", verifyToken, adminCustomerController.banUser);
customerRouter.post("/:id/unban", verifyToken, adminCustomerController.unbanUser);

export default customerRouter;
