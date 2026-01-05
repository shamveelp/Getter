import { inject, injectable } from "inversify";
import bcrypt from "bcryptjs";
import { TYPES } from "../../core/types";
import { IUserAuthService } from "../../core/interfaces/services/user/IUserAuth.service";
import { IUserAuthRepository } from "../../core/interfaces/repositories/user/IUserAuth.repository";
import { IJwtService } from "../../core/interfaces/services/IJWT.service";
import { IEmailService } from "../../core/interfaces/services/IEmail.service";
import { IUser } from "../../models/user.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";
import { OAuth2Client } from "google-auth-library";
import logger from "../../utils/logger";
import crypto from "crypto";

@injectable()
export class UserAuthService implements IUserAuthService {
    private googleClient: OAuth2Client;

    constructor(
        @inject(TYPES.IUserAuthRepository) private _userAuthRepository: IUserAuthRepository,
        @inject(TYPES.IJwtService) private _jwtService: IJwtService,
        @inject(TYPES.IEmailService) private _emailService: IEmailService
    ) {
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async registerUser(
        username: string,
        email: string,
        password?: string,
        name?: string,
        referralCode?: string
    ): Promise<void> {
        const existingUserByEmail = await this._userAuthRepository.findByEmail(email);
        if (existingUserByEmail) {
            throw new CustomError("Email already registered", StatusCode.CONFLICT);
        }

        const existingUserByUsername = await this._userAuthRepository.findByUsername(username);
        if (existingUserByUsername) {
            throw new CustomError("Username already taken", StatusCode.CONFLICT);
        }
    }

    async verifyAndRegisterUser(
        username: string,
        email: string,
        password?: string,
        name?: string,
        referralCode?: string
    ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
        await this.registerUser(username, email, password, name, referralCode);

        let hashedPassword = "";
        if (password) {
            hashedPassword = await bcrypt.hash(password, 12);
        }

        const newUser = await this._userAuthRepository.create({
            username,
            email,
            password: hashedPassword,
            name: name || username,
            isActive: true,
        });

        // Send welcome email
        try {
            await this._emailService.sendWelcomeEmail(email, username);
        } catch (error) {
            logger.warn("Failed to send welcome email:", error);
        }

        const accessToken = this._jwtService.generateAccessToken(newUser._id.toString(), "user", 0);
        const refreshToken = this._jwtService.generateRefreshToken(newUser._id.toString(), "user", 0);

        return { user: newUser, accessToken, refreshToken };
    }

    async checkUsernameAvailability(username: string): Promise<boolean> {
        const user = await this._userAuthRepository.findByUsername(username);
        return !user;
    }

    async checkEmailAvailability(email: string): Promise<boolean> {
        const user = await this._userAuthRepository.findByEmail(email);
        return !user;
    }

    async generateUsername(email?: string): Promise<string> {
        let baseUsername: string;
        
        if (email) {
            // Generate from email
            baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        } else {
            // Generate random
            baseUsername = `user_${crypto.randomBytes(4).toString("hex")}`;
        }

        let username = baseUsername;
        let counter = 1;
        
        // Check if username is available, if not add numbers
        while (!(await this.checkUsernameAvailability(username))) {
            username = `${baseUsername}${counter}`;
            counter++;
        }
        
        return username;
    }

    async loginUser(email: string, password?: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
        const user = await this._userAuthRepository.findByEmail(email);
        if (!user) {
            throw new CustomError("Invalid credentials", StatusCode.UNAUTHORIZED);
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

        const accessToken = this._jwtService.generateAccessToken(user._id.toString(), "user", 0);
        const refreshToken = this._jwtService.generateRefreshToken(user._id.toString(), "user", 0);

        return { user, accessToken, refreshToken };
    }

    async requestForgotPassword(email: string): Promise<void> {
        const user = await this._userAuthRepository.findByEmail(email);
        if (!user) {
            throw new CustomError("User not found", StatusCode.NOT_FOUND);
        }
    }

    async resetPassword(email: string, newPassword?: string): Promise<void> {
        if (!newPassword) throw new CustomError("Password required", StatusCode.BAD_REQUEST);

        const user = await this._userAuthRepository.findByEmail(email);
        if (!user) {
            throw new CustomError("User not found", StatusCode.NOT_FOUND);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await this._userAuthRepository.update(user._id.toString(), { password: hashedPassword });

        // Send password reset success email
        try {
            await this._emailService.sendPasswordResetSuccessEmail(email);
        } catch (error) {
            logger.warn("Failed to send password reset success email:", error);
        }
    }

    async loginWithGoogle(idToken: string, referralCode?: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();

            if (!payload || !payload.email) {
                throw new CustomError("Invalid Google Token", StatusCode.UNAUTHORIZED);
            }

            const email = payload.email;
            const name = payload.name || "";
            let user = await this._userAuthRepository.findByEmail(email);

            if (!user) {
                const username = await this.generateUsername(email);
                user = await this._userAuthRepository.create({
                    email,
                    username,
                    name,
                    isActive: true,
                });

                // Send welcome email for Google users
                try {
                    await this._emailService.sendWelcomeEmail(email, username);
                } catch (error) {
                    logger.warn("Failed to send welcome email:", error);
                }
            }

            const accessToken = this._jwtService.generateAccessToken(user._id.toString(), "user", 0);
            const refreshToken = this._jwtService.generateRefreshToken(user._id.toString(), "user", 0);

            return { user, accessToken, refreshToken };

        } catch (error) {
            logger.error("Google verify error", error);
            throw new CustomError("Google Authentication Failed", StatusCode.UNAUTHORIZED);
        }
    }
}