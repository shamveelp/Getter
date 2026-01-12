import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { UploadController } from "../../controllers/admin/upload.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadRouter = Router();
const uploadController = container.get<UploadController>(TYPES.IUploadController);

uploadRouter.post("/", verifyToken, upload.single("image"), uploadController.uploadImage);

export default uploadRouter;
