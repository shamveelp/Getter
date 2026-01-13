import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { EventService } from "../../services/event.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";

@injectable()
export class EventController {
    constructor(
        @inject(TYPES.IEventService) private _eventService: EventService
    ) { }

    getAllEvents = async (req: Request, res: Response) => {
        try {
            const filters = req.query;
            const result = await this._eventService.searchEvents(filters);
            res.status(StatusCode.OK).json({ success: true, data: result.data, meta: { total: result.total } });
        } catch (error) {
            logger.error("Error getting all events:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: (error as Error).message });
        }
    };

    getEventById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this._eventService.getEventById(id);
            if (!result) {
                res.status(StatusCode.NOT_FOUND).json({ success: false, error: "Event not found" });
                return;
            }
            res.status(StatusCode.OK).json({ success: true, data: result });
        } catch (error) {
            logger.error("Error getting event by id:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: (error as Error).message });
        }
    };

    createEvent = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const result = await this._eventService.createEvent(data);
            res.status(StatusCode.CREATED).json({ success: true, data: result });
        } catch (error) {
            logger.error("Error creating event:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: (error as Error).message });
        }
    };

    updateEvent = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await this._eventService.updateEvent(id, data);
            res.status(StatusCode.OK).json({ success: true, data: result });
        } catch (error) {
            logger.error("Error updating event:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: (error as Error).message });
        }
    };

    endEvent = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this._eventService.endEvent(id);
            res.status(StatusCode.OK).json({ success: true, data: result });
        } catch (error) {
            logger.error("Error ending event:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: (error as Error).message });
        }
    };
}
