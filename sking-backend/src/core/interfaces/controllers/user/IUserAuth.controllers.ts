import { Request, Response } from "express";

export interface IUserAuthController {
    register(req: Request, res: Response): Promise<void>;
    requestOtp(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
    checkUsername(req: Request, res: Response): Promise<void>;
    checkEmail(req: Request, res: Response): Promise<void>;
    generateUsername(req: Request, res: Response): Promise<void>;
    forgotPassword(req: Request, res: Response): Promise<void>;
    verifyForgotPasswordOtp(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<void>;
    refreshAccessToken(req: Request, res: Response): Promise<void>;
    googleLogin(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    getMe(req: Request, res: Response): Promise<void>;
}