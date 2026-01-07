import { Request, Response } from "express";

export interface IAdminCustomerController {
    getAllUsers(req: Request, res: Response): Promise<void>;
    getUserById(req: Request, res: Response): Promise<void>;
    banUser(req: Request, res: Response): Promise<void>;
    unbanUser(req: Request, res: Response): Promise<void>;
}
