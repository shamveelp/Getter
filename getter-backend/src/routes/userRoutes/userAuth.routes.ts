import { Router } from "express";
import rateLimit from 'express-rate-limit';
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IUserAuthController } from "../../core/interfaces/controllers/user/IUserAuth.controllers";
import { validateResource } from "../../middlewares/validateResource.middleware";
import { verifyToken } from "../../middlewares/auth.middleware";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  checkUsernameSchema,
  checkEmailSchema
} from "../../validations/user/userAuth.validation";

import { authLimiter, otpLimiter } from "../../middlewares/rateLimit.middleware";

const userAuthRouter = Router();
const userAuthController = container.get<IUserAuthController>(TYPES.IUserAuthController);

// Authentication routes
userAuthRouter.post("/register", authLimiter, validateResource(registerSchema), (req, res) => userAuthController.register(req, res));
userAuthRouter.post("/login", authLimiter, validateResource(loginSchema), (req, res) => userAuthController.login(req, res));
userAuthRouter.get("/me", verifyToken, (req, res) => userAuthController.getMe(req, res));
userAuthRouter.post("/logout", (req, res) => userAuthController.logout(req, res));
userAuthRouter.post("/logout-all", verifyToken, (req, res) => userAuthController.logoutAll(req, res));

// OTP routes with rate limiting
userAuthRouter.post("/request-otp", otpLimiter, (req, res) => userAuthController.requestOtp(req, res));
userAuthRouter.post("/verify-otp", authLimiter, validateResource(verifyOtpSchema), (req, res) => userAuthController.verifyOtp(req, res));
userAuthRouter.post("/resend-otp", otpLimiter, (req, res) => userAuthController.resendOtp(req, res));

// Validation routes
userAuthRouter.post("/check-username", validateResource(checkUsernameSchema), (req, res) => userAuthController.checkUsername(req, res));
userAuthRouter.post("/check-email", validateResource(checkEmailSchema), (req, res) => userAuthController.checkEmail(req, res));
userAuthRouter.get("/generate-username", (req, res) => userAuthController.generateUsername(req, res));

// Password reset routes with rate limiting
userAuthRouter.post("/forgot-password", otpLimiter, validateResource(forgotPasswordSchema), (req, res) => userAuthController.forgotPassword(req, res));
userAuthRouter.post("/verify-forgot-otp", authLimiter, (req, res) => userAuthController.verifyForgotPasswordOtp(req, res));
userAuthRouter.post("/reset-password", authLimiter, validateResource(resetPasswordSchema), (req, res) => userAuthController.resetPassword(req, res));

// Token management
userAuthRouter.post("/refresh-token", (req, res) => userAuthController.refreshAccessToken(req, res));

// Google OAuth
userAuthRouter.post("/google-login", authLimiter, (req, res) => userAuthController.googleLogin(req, res));

export default userAuthRouter;