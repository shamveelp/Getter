import { inject, injectable } from "inversify";
import bcrypt from "bcryptjs";
import { TYPES } from "../../core/types";
import { IAdminAuthService } from "../../core/interfaces/services/admin/IAdminAuth.service";
import { IAdminAuthRepository } from "../../core/interfaces/repositories/admin/IAdminAuth.repository";
import { IJwtService } from "../../core/interfaces/services/IJWT.service";
import { IEmailService } from "../../core/interfaces/services/IEmail.service";
import { IUser } from "../../models/user.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";

@injectable()
export class AdminAuthService implements IAdminAuthService {
    constructor(
        @inject(TYPES.IAdminAuthRepository) private _adminAuthRepository: IAdminAuthRepository,
        @inject(TYPES.IJwtService) private _jwtService: IJwtService,
        @inject(TYPES.IEmailService) private _emailService: IEmailService
    ) { }

    async loginAdmin(email: string, password?: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
        const user = await this._adminAuthRepository.findByEmail(email);
        if (!user) {
            throw new CustomError("Invalid credentials", StatusCode.UNAUTHORIZED);
        }

        if (!user.isAdmin) {
            throw new CustomError("Access denied", StatusCode.FORBIDDEN);
        }

        if (!user.password || !password) {
            throw new CustomError("Invalid credentials", StatusCode.UNAUTHORIZED);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new CustomError("Invalid credentials", StatusCode.UNAUTHORIZED);
        }

        if (!user.isActive) {
            throw new CustomError("Account is deactivated", StatusCode.FORBIDDEN);
        }

        const accessToken = this._jwtService.generateAccessToken(user._id.toString(), "admin", user.tokenVersion);
        const refreshToken = this._jwtService.generateRefreshToken(user._id.toString(), "admin", user.tokenVersion);

        return { user, accessToken, refreshToken };
    }

    async resetPassword(email: string, newPassword?: string): Promise<void> {
        if (!newPassword) throw new CustomError("Password required", StatusCode.BAD_REQUEST);

        const user = await this._adminAuthRepository.findByEmail(email);
        if (!user) {
            throw new CustomError("User not found", StatusCode.NOT_FOUND);
        }

        if (!user.isAdmin) {
            throw new CustomError("Access denied", StatusCode.FORBIDDEN);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        // Invalidate all existing tokens by incrementing version
        await this._adminAuthRepository.update(user._id.toString(), {
            password: hashedPassword,
            tokenVersion: (user.tokenVersion || 0) + 1
        });

        try {
            await this._emailService.sendPasswordResetSuccessEmail(email);
        } catch (error) {
            logger.warn("Failed to send password reset success email:", error);
        }
    }

    async getAdminById(id: string): Promise<IUser> {
        const user = await this._adminAuthRepository.findById(id);
        if (!user) {
            throw new CustomError("Admin not found", StatusCode.NOT_FOUND);
        }
        if (!user.isAdmin) {
            throw new CustomError("Access denied", StatusCode.FORBIDDEN);
        }
        return user;
    }
}
