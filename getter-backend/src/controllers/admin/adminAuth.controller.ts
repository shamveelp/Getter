import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { IAdminAuthController } from "../../core/interfaces/controllers/admin/IAdminAuth.controller";
import { IAdminAuthService } from "../../core/interfaces/services/admin/IAdminAuth.service";
import { IOTPService } from "../../core/interfaces/services/IOTP.service";
import { IJwtService } from "../../core/interfaces/services/IJWT.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";
import {
    AdminLoginDto,
    AdminForgotPasswordDto,
    AdminResetPasswordDto,
    AdminLoginResponseDto
} from "../../core/dtos/admin/adminAuth.dto";
import { SuccessMessages, ErrorMessages, LoggerMessages } from "../../enums/messages.enum";

@injectable()
export class AdminAuthController implements IAdminAuthController {
    constructor(
        @inject(TYPES.IAdminAuthService) private _adminAuthService: IAdminAuthService,
        @inject(TYPES.IOTPService) private _otpService: IOTPService,
        @inject(TYPES.IJwtService) private _jwtService: IJwtService
    ) { }

    login = async (req: Request, res: Response) => {
        try {
            const loginDto = req.body as AdminLoginDto;
            const { email, password } = loginDto;

            const { user, accessToken, refreshToken } = await this._adminAuthService.loginAdmin(email!, password!);

            this._jwtService.setTokens(res, accessToken, refreshToken, "admin");

            const response = new AdminLoginResponseDto(user, SuccessMessages.USER_LOGGED_IN);
            res.status(StatusCode.OK).json(response);
        } catch (error) {
            logger.error(LoggerMessages.LOGIN_ERROR, error);
            const errorMessage = error instanceof CustomError ? error.message : ErrorMessages.FAILED_LOGIN;
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.UNAUTHORIZED;

            res.status(statusCode).json({
                success: false,
                error: errorMessage
            });
        }
    };

    forgotPassword = async (req: Request, res: Response) => {
        try {
            const forgotPasswordDto = req.body as AdminForgotPasswordDto;
            const { email } = forgotPasswordDto;

            await this._otpService.requestForgotPasswordOtp(email!, "admin");
            res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessages.PASSWORD_RESET_OTP_SENT
            });
        } catch (error) {
            logger.error(LoggerMessages.FORGOT_PASSWORD_OTP_ERROR, error);
            const errorMessage = error instanceof CustomError ? error.message : ErrorMessages.FAILED_RESET_CODE;
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.BAD_REQUEST;

            res.status(statusCode).json({
                success: false,
                error: errorMessage
            });
        }
    };

    verifyForgotPasswordOtp = async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body;

            await this._otpService.verifyForgotPasswordOtp(email, otp);
            res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessages.OTP_VERIFIED
            });
        } catch (error) {
            logger.error(LoggerMessages.VERIFY_FORGOT_PASSWORD_OTP_ERROR, error);
            const errorMessage = error instanceof CustomError ? error.message : ErrorMessages.INVALID_OTP;

            res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                error: errorMessage
            });
        }
    };

    resetPassword = async (req: Request, res: Response) => {
        try {
            const resetPasswordDto = req.body as AdminResetPasswordDto;
            const { email, newPassword } = resetPasswordDto;

            await this._adminAuthService.resetPassword(email!, newPassword!);
            res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessages.PASSWORD_RESET
            });
        } catch (error) {
            logger.error(LoggerMessages.RESET_PASSWORD_ERROR, error);
            const errorMessage = error instanceof CustomError ? error.message : ErrorMessages.FAILED_RESET_PASSWORD;

            res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                error: errorMessage
            });
        }
    };

    refreshAccessToken = async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                res.status(StatusCode.UNAUTHORIZED).json({
                    success: false,
                    error: ErrorMessages.REFRESH_TOKEN_REQUIRED
                });
                return;
            }

            const decoded = this._jwtService.verifyRefreshToken(refreshToken) as {
                id: string;
                role: string;
                tokenVersion?: number;
            };

            if (decoded.role !== 'admin') {
                throw new CustomError("Access denied", StatusCode.FORBIDDEN);
            }

            const accessToken = this._jwtService.generateAccessToken(
                decoded.id,
                decoded.role,
                decoded.tokenVersion ?? 0
            );
            const newRefreshToken = this._jwtService.generateRefreshToken(
                decoded.id,
                decoded.role,
                decoded.tokenVersion ?? 0
            );

            this._jwtService.setTokens(res, accessToken, newRefreshToken, decoded.role);

            // Fetch admin data to return with refresh
            const user = await this._adminAuthService.getAdminById(decoded.id);

            // Token Version Validation (Revocation Check)
            if (user.tokenVersion !== decoded.tokenVersion) {
                throw new CustomError("Session expired", StatusCode.UNAUTHORIZED);
            }

            res.status(StatusCode.OK).json({
                success: true,
                user
            });
        } catch (error) {
            logger.error(LoggerMessages.REFRESH_TOKEN_ERROR, error);
            // Critical: Clear cookies if refresh fails so middleware doesn't loop
            this._jwtService.clearTokens(res);
            res.status(StatusCode.UNAUTHORIZED).json({
                success: false,
                error: ErrorMessages.INVALID_REFRESH_TOKEN
            });
        }
    };

    getMe = async (req: Request, res: Response) => {
        try {
            // @ts-ignore - user is attached by middleware
            const userId = req.user?.id;

            if (!userId) {
                res.status(StatusCode.UNAUTHORIZED).json({
                    success: false,
                    error: ErrorMessages.UNAUTHORIZED
                });
                return;
            }

            const user = await this._adminAuthService.getAdminById(userId);

            res.status(StatusCode.OK).json({
                success: true,
                user
            });
        } catch (error) {
            logger.error("Error in getMe:", error);
            const errorMessage = error instanceof CustomError ? error.message : "Failed to fetch admin profile";
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;

            res.status(statusCode).json({
                success: false,
                error: errorMessage
            });
        }
    };

    logout = async (req: Request, res: Response) => {
        try {
            this._jwtService.clearTokens(res);
            logger.info("Admin logged out successfully");
            res.status(StatusCode.OK).json({
                success: true,
                message: SuccessMessages.USER_LOGGED_OUT
            });
        } catch (error) {
            logger.error(LoggerMessages.LOGOUT_ERROR, error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: ErrorMessages.FAILED_LOGOUT
            });
        }
    };
}
