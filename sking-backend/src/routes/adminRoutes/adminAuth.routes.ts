import { Router } from "express";
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IAdminAuthController } from "../../core/interfaces/controllers/admin/IAdminAuth.controller";

import { validateResource } from "../../middlewares/validateResource.middleware";
import { authLimiter } from "../../middlewares/rateLimit.middleware";
import { verifyToken } from "../../middlewares/auth.middleware";
import {
    adminLoginSchema,
    adminForgotPasswordSchema,
    adminResetPasswordSchema
} from "../../validations/admin/adminAuth.validation";

const adminAuthRouter = Router();
const adminAuthController = container.get<IAdminAuthController>(TYPES.IAdminAuthController);

adminAuthRouter.post("/login", authLimiter, validateResource(adminLoginSchema), adminAuthController.login.bind(adminAuthController));
adminAuthRouter.post("/forgot-password", authLimiter, validateResource(adminForgotPasswordSchema), adminAuthController.forgotPassword.bind(adminAuthController));
adminAuthRouter.post("/verify-forgot-otp", authLimiter, adminAuthController.verifyForgotPasswordOtp.bind(adminAuthController));
adminAuthRouter.post("/reset-password", authLimiter, validateResource(adminResetPasswordSchema), adminAuthController.resetPassword.bind(adminAuthController));
adminAuthRouter.post("/refresh-token", adminAuthController.refreshAccessToken.bind(adminAuthController));
adminAuthRouter.get("/me", verifyToken, adminAuthController.getMe.bind(adminAuthController));
adminAuthRouter.post("/logout", adminAuthController.logout.bind(adminAuthController));

export default adminAuthRouter;
