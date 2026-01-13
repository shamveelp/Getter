import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { EventController } from "../../controllers/admin/adminEvent.controller";
import { verifyToken } from "../../middlewares/auth.middleware";

const adminEventRouter = Router();
const eventController = container.get<EventController>(TYPES.IEventController);

adminEventRouter.get("/", verifyToken, eventController.getAllEvents);
adminEventRouter.post("/", verifyToken, eventController.createEvent);
adminEventRouter.put("/:id", verifyToken, eventController.updateEvent);
adminEventRouter.post("/:id/end", verifyToken, eventController.endEvent);

export default adminEventRouter;
