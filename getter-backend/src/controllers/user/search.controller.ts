import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { ServiceService } from "../../services/service.service"; // Reusing service

import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";

@injectable()
export class SearchController {
    constructor(
        @inject(TYPES.IServiceService) private _serviceService: ServiceService
    ) { }

    searchServices = async (req: Request, res: Response) => {
        try {
            const filters = req.query;
            const result = await this._serviceService.searchServices(filters);
            res.status(StatusCode.OK).json({ success: true, data: result });
        } catch (error) {
            logger.error("Error searching services:", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: (error as Error).message });
        }
    };

    getServiceDetail = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this._serviceService.getServiceById(id);
            if (!result) throw new CustomError("Service not found", StatusCode.NOT_FOUND);
            res.status(StatusCode.OK).json({ success: true, data: result });
        } catch (error) {
            logger.error("Error getting service detail:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: (error as Error).message });
        }
    };


}
