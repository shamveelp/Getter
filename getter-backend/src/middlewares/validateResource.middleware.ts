import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { StatusCode } from "../enums/statusCode.enums";

export const validateResource = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: "Validation Error",
                errors: error.issues,
            });
            return;
        }
        next(error);
    }
};
