import { Router } from "express";
import rateLimit from 'express-rate-limit';
import container from "../../core/inversify.config";
import { TYPES } from "../../core/types";
import { IUserAuthController } from "../../core/interfaces/controllers/user/IUserAuth.controllers";
import { validateResource } from "../../middlewares/validateResource.middleware";
import { 
    registerSchema, 
    loginSchema, 
    forgotPasswordSchema, 
    resetPasswordSchema, 
    verifyOtpSchema,
    checkUsernameSchema,
    checkEmailSchema
} from "../../validations/user/userAuth.validation";

const userAuthRouter = Router();
const userAuthController = container.get<IUserAuthController>(TYPES.IUserAuthController);

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many OTP requests, please try again later."
});

const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per windowMs
  message: "Too many password reset requests, please try again later."
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later."
});

// Apply general rate limiting to all routes
userAuthRouter.use(generalLimiter);

// Authentication routes
userAuthRouter.post("/register", validateResource(registerSchema), (req, res) => userAuthController.register(req, res));
userAuthRouter.post("/login", validateResource(loginSchema), (req, res) => userAuthController.login(req, res));
userAuthRouter.post("/logout", (req, res) => userAuthController.logout(req, res));

// OTP routes with rate limiting
userAuthRouter.post("/request-otp", otpLimiter, (req, res) => userAuthController.requestOtp(req, res));
userAuthRouter.post("/verify-otp", validateResource(verifyOtpSchema), (req, res) => userAuthController.verifyOtp(req, res));
userAuthRouter.post("/resend-otp", otpLimiter, (req, res) => userAuthController.resendOtp(req, res));

// Validation routes
userAuthRouter.post("/check-username", validateResource(checkUsernameSchema), (req, res) => userAuthController.checkUsername(req, res));
userAuthRouter.post("/check-email", validateResource(checkEmailSchema), (req, res) => userAuthController.checkEmail(req, res));
userAuthRouter.get("/generate-username", (req, res) => userAuthController.generateUsername(req, res));

// Password reset routes with rate limiting
userAuthRouter.post("/forgot-password", resetLimiter, validateResource(forgotPasswordSchema), (req, res) => userAuthController.forgotPassword(req, res));
userAuthRouter.post("/verify-forgot-otp", (req, res) => userAuthController.verifyForgotPasswordOtp(req, res));
userAuthRouter.post("/reset-password", validateResource(resetPasswordSchema), (req, res) => userAuthController.resetPassword(req, res));

// Token management
userAuthRouter.post("/refresh-token", (req, res) => userAuthController.refreshAccessToken(req, res));

// Google OAuth
userAuthRouter.post("/google-login", (req, res) => userAuthController.googleLogin(req, res));

export default userAuthRouter;