import { IUser } from "../../../../models/user.model";

export interface IUserAuthService {
    registerUser(
        username: string,
        email: string,
        password?: string,
        name?: string,
        referralCode?: string
    ): Promise<void>;
    verifyAndRegisterUser(
        username: string,
        email: string,
        password?: string,
        name?: string,
        referralCode?: string
    ): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;
    checkUsernameAvailability(username: string): Promise<boolean>;
    checkEmailAvailability(email: string): Promise<boolean>;
    generateUsername(email?: string): Promise<string>;
    loginUser(email: string, password?: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;
    requestForgotPassword(email: string): Promise<void>;
    resetPassword(email: string, newPassword?: string): Promise<void>;
    loginWithGoogle(payload: { token?: string, code?: string, referralCode?: string }): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;
    getUserById(userId: string): Promise<IUser>;
}