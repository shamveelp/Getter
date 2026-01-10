import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { IAdminCustomerController } from "../../core/interfaces/controllers/admin/IAdminCustomer.controller";
import { IAdminCustomerService } from "../../core/interfaces/services/admin/IAdminCustomer.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";

@injectable()
export class AdminCustomerController implements IAdminCustomerController {
    constructor(
        @inject(TYPES.IAdminCustomerService) private _adminCustomerService: IAdminCustomerService
    ) { }

    getAllUsers = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;

            const result = await this._adminCustomerService.getAllUsers(page, limit, search);
            res.status(StatusCode.OK).json({
                success: true,
                data: result
            });
        } catch (error) {
            logger.error("Error getting all users:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({
                success: false,
                error: (error as Error).message
            });
        }
    };

    getUserById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this._adminCustomerService.getUserById(id);
            res.status(StatusCode.OK).json({
                success: true,
                data: result
            });
        } catch (error) {
            logger.error(`Error getting user by id ${req.params.id}:`, error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({
                success: false,
                error: (error as Error).message
            });
        }
    };

    banUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this._adminCustomerService.banUser(id);
            res.status(StatusCode.OK).json({
                success: true,
                message: "User banned successfully"
            });
        } catch (error) {
            logger.error(`Error banning user ${req.params.id}:`, error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({
                success: false,
                error: (error as Error).message
            });
        }
    };

    unbanUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this._adminCustomerService.unbanUser(id);
            res.status(StatusCode.OK).json({
                success: true,
                message: "User unbanned successfully"
            });
        } catch (error) {
            logger.error(`Error unbanning user ${req.params.id}:`, error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({
                success: false,
                error: (error as Error).message
            });
        }
    };
}
