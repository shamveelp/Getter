import { IUser } from "../../../../models/user.model";

export interface IAdminAuthService {
    loginAdmin(email: string, password?: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;
    resetPassword(email: string, newPassword?: string): Promise<void>;
    getAdminById(id: string): Promise<IUser>;
}
