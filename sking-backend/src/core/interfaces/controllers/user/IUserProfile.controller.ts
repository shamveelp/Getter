import { Request, Response } from "express";

export interface IUserProfileController {
    getProfile(req: Request, res: Response): Promise<void>;
    updateProfile(req: Request, res: Response): Promise<void>;
    uploadProfilePicture(req: Request, res: Response): Promise<void>;
}
