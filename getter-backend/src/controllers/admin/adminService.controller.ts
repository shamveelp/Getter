import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { ServiceService } from "../../services/service.service"; // Use class directly or interface if available
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";

@injectable()
export class ServiceController {
    constructor(
        @inject(TYPES.IServiceService) private _serviceService: ServiceService
    ) { }

    getAllServices = async (req: Request, res: Response) => {
        try {
            const filters = req.query;
            const result = await this._serviceService.searchServices(filters);
            res.status(StatusCode.OK).json({ success: true, data: result.data, meta: { total: result.total } });
            // My frontend expects result.data.data? No, frontend expects:
            // if (data.success) { setServices(data.data.users?? No services) }
            // Wait, my Frontend 'getAllServices' in 'adminServiceApiService' returns response.data.
            // Page.tsx says: if (data.success) { setServices(data.data); }
            // So my backend should return { success: true, data: [...] }. 
            // But searchServices returns { data: [...], total: N }. 
            // So I should return { success: true, data: result.data, total: result.total } Or follow standard pagination response.
            // Let's look at searchController: res.status(StatusCode.OK).json({ success: true, data: result });
            // result is { data, total }. So frontend gets { success: true, data: { data: [], total: N } }.
            // So frontend needs to access data.data.data. 
            // Let's make it clean: { success: true, data: result.data, total: result.total }
        } catch (error) {
            logger.error("Error getting all services:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: (error as Error).message });
        }
    };

    createService = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            // Add user info if needed? req.user?
            const result = await this._serviceService.createService(data);
            res.status(StatusCode.CREATED).json({ success: true, data: result });
        } catch (error) {
            logger.error("Error creating service:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: (error as Error).message });
        }
    };

    updateService = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await this._serviceService.updateService(id, data);
            res.status(StatusCode.OK).json({ success: true, data: result });
        } catch (error) {
            logger.error("Error updating service:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: (error as Error).message });
        }
    };

    deleteService = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this._serviceService.deleteService(id);
            res.status(StatusCode.OK).json({ success: true, data: result });
        } catch (error) {
            logger.error("Error deleting service:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: (error as Error).message });
        }
    };

    unlistService = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this._serviceService.unlistService(id);
            res.status(StatusCode.OK).json({ success: true, data: result });
        } catch (error) {
            logger.error("Error unlisting service:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: (error as Error).message });
        }
    }
}
