import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { ServiceController } from "../../controllers/admin/adminService.controller";
import { verifyToken } from "../../middlewares/auth.middleware";

const adminServiceRouter = Router();
const serviceController = container.get<ServiceController>(TYPES.IServiceController);

adminServiceRouter.get("/", verifyToken, serviceController.getAllServices);
adminServiceRouter.get("/:id", verifyToken, serviceController.getServiceById);
adminServiceRouter.post("/", verifyToken, serviceController.createService);
adminServiceRouter.put("/:id", verifyToken, serviceController.updateService);
adminServiceRouter.delete("/:id", verifyToken, serviceController.deleteService);
adminServiceRouter.patch("/:id/unlist", verifyToken, serviceController.unlistService);
adminServiceRouter.patch("/:id/list", verifyToken, serviceController.listService);

export default adminServiceRouter;
