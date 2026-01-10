import { IUser } from "../../../../models/user.model";
import { UpdateProfileDto } from "../../../dtos/user/userProfile.dto";

export interface IUserProfileService {
    getProfile(userId: string): Promise<IUser>;
    updateProfile(userId: string, data: UpdateProfileDto): Promise<IUser>;
    uploadProfilePicture(userId: string, file: any): Promise<string>;
}
