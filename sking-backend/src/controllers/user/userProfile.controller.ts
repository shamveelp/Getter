import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { IUserProfileController } from "../../core/interfaces/controllers/user/IUserProfile.controller";
import { IUserProfileService } from "../../core/interfaces/services/user/IUserProfile.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";
import { ProfileResponseDto, UpdateProfileDto } from "../../core/dtos/user/userProfile.dto";
import { SuccessMessages } from "../../enums/messages.enum";

@injectable()
export class UserProfileController implements IUserProfileController {

    constructor(
        @inject(TYPES.IUserProfileService) private _userProfileService: IUserProfileService
    ) { }

    getProfile = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const user = await this._userProfileService.getProfile(userId);
            const response = new ProfileResponseDto(user);
            res.status(StatusCode.OK).json(response);
        } catch (error) {
            logger.error("Get Profile Error", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: "Failed to fetch profile" });
        }
    };

    updateProfile = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const updateDto = req.body as UpdateProfileDto;

            const updatedUser = await this._userProfileService.updateProfile(userId, updateDto);
            const response = new ProfileResponseDto(updatedUser);

            res.status(StatusCode.OK).json({ ...response, message: "Profile updated successfully" });
        } catch (error) {
            logger.error("Update Profile Error", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: "Failed to update profile" });
        }
    };

    uploadProfilePicture = async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const file = req.file;

            if (!file) {
                res.status(StatusCode.BAD_REQUEST).json({ success: false, error: "No image file provided" });
                return;
            }

            const imageUrl = await this._userProfileService.uploadProfilePicture(userId, file);

            res.status(StatusCode.OK).json({
                success: true,
                message: "Profile picture uploaded successfully",
                imageUrl
            });
        } catch (error) {
            logger.error("Upload Profile Picture Error", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: "Failed to upload image" });
        }
    };
}
