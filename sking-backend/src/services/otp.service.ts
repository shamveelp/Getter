import { injectable, inject } from "inversify";
import { IOTPService } from "../core/interfaces/services/IOTP.service";
import { IEmailService } from "../core/interfaces/services/IEmail.service";
import { TYPES } from "../core/types";
import logger from "../utils/logger";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enums";

@injectable()
export class OTPService implements IOTPService {
    private otpStore: Map<string, { otp: string; expires: number; attempts: number }> = new Map();
    private readonly MAX_ATTEMPTS = 3;
    private readonly OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

    constructor(
        @inject(TYPES.IEmailService) private _emailService: IEmailService
    ) { }

    async requestOtp(email: string, type: string): Promise<void> {
        const otp = this.generateOtp();
        const expires = Date.now() + this.OTP_EXPIRY;

        this.otpStore.set(email, { otp, expires, attempts: 0 });

        // For development/testing purposes
        logger.info(`🔐 OTP for ${email}: ${otp}`);

        try {
            await this._emailService.sendOtpEmail(email, otp);
            logger.info(`📧 OTP sent to ${email} for ${type}`);
        } catch (error) {
            this.otpStore.delete(email);
            throw new CustomError("Failed to send OTP email", StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async requestForgotPasswordOtp(email: string, type: string): Promise<void> {
        const otp = this.generateOtp();
        const expires = Date.now() + this.OTP_EXPIRY;

        this.otpStore.set(`reset_${email}`, { otp, expires, attempts: 0 });

        // For development/testing purposes
        logger.info(`🔐 Reset OTP for ${email}: ${otp}`);

        try {
            await this._emailService.sendForgotPasswordOtpEmail(email, otp);
            logger.info(`📧 Password reset OTP sent to ${email}`);
        } catch (error) {
            this.otpStore.delete(`reset_${email}`);
            throw new CustomError("Failed to send reset OTP email", StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async verifyOtp(email: string, otp: string, isPasswordReset = false): Promise<boolean> {
        const key = isPasswordReset ? `reset_${email}` : email;
        const record = this.otpStore.get(key);

        if (!record) {
            throw new CustomError("OTP not found or expired", StatusCode.BAD_REQUEST);
        }

        if (Date.now() > record.expires) {
            this.otpStore.delete(key);
            throw new CustomError("OTP expired", StatusCode.BAD_REQUEST);
        }

        if (record.attempts >= this.MAX_ATTEMPTS) {
            this.otpStore.delete(key);
            throw new CustomError("Maximum OTP attempts exceeded", StatusCode.BAD_REQUEST);
        }

        if (record.otp !== otp) {
            record.attempts++;
            throw new CustomError(`Invalid OTP. ${this.MAX_ATTEMPTS - record.attempts} attempts remaining`, StatusCode.BAD_REQUEST);
        }

        this.otpStore.delete(key);
        return true;
    }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async verifyForgotPasswordOtp(email: string, otp: string): Promise<boolean> {
        return this.verifyOtp(email, otp, true);
    }
}