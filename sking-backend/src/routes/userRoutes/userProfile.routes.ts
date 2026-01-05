import { Router } from "express";
import multer from "multer";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IUserProfileController } from "../../core/interfaces/controllers/user/IUserProfile.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { validateResource } from "../../middlewares/validateResource.middleware";
import { generalLimiter } from "../../middlewares/rateLimit.middleware";

const userProfileRouter = Router();
const userProfileController = container.get<IUserProfileController>(TYPES.IUserProfileController);

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

userProfileRouter.use(verifyToken);
userProfileRouter.use(generalLimiter);

userProfileRouter.get("/", (req, res) => userProfileController.getProfile(req, res));
userProfileRouter.put("/", (req, res) => userProfileController.updateProfile(req, res));
userProfileRouter.post("/upload-picture", upload.single("image"), (req, res) => userProfileController.uploadProfilePicture(req, res));

export default userProfileRouter;
