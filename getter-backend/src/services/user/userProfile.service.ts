import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IUserProfileService } from "../../core/interfaces/services/user/IUserProfile.service";
import { IUserAuthRepository } from "../../core/interfaces/repositories/user/IUserAuth.repository";
import { IUser } from "../../models/user.model";
import { UpdateProfileDto } from "../../core/dtos/user/userProfile.dto";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";
import cloudinary from "../../config/cloudinary";
import logger from "../../utils/logger";
import streamifier from "streamifier";

@injectable()
export class UserProfileService implements IUserProfileService {

    constructor(
        @inject(TYPES.IUserAuthRepository) private _userAuthRepository: IUserAuthRepository
    ) { }

    async getProfile(userId: string): Promise<IUser> {
        const user = await this._userAuthRepository.findById(userId);
        if (!user) {
            throw new CustomError("User not found", StatusCode.NOT_FOUND);
        }
        return user;
    }

    async updateProfile(userId: string, data: UpdateProfileDto): Promise<IUser> {
        const user = await this._userAuthRepository.findById(userId);
        if (!user) {
            throw new CustomError("User not found", StatusCode.NOT_FOUND);
        }

        await this._userAuthRepository.update(userId, data);

        // Return updated user
        const updatedUser = await this._userAuthRepository.findById(userId);
        return updatedUser!;
    }

    async uploadProfilePicture(userId: string, file: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "user_profiles",
                    public_id: `user_${userId}_profile`,
                    overwrite: true,
                    resource_type: "image"
                },
                async (error, result) => {
                    if (error) {
                        logger.error("Cloudinary upload error", error);
                        return reject(new CustomError("Image upload failed", StatusCode.INTERNAL_SERVER_ERROR));
                    }

                    if (result?.secure_url) {
                        await this._userAuthRepository.update(userId, { profilePicture: result.secure_url });
                        resolve(result.secure_url);
                    } else {
                        reject(new CustomError("Image upload failed", StatusCode.INTERNAL_SERVER_ERROR));
                    }
                }
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
}
