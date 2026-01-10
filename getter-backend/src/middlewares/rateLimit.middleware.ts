import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: "Too many attempts, please try again after 15 minutes",
        });
    },
});

export const otpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 OTP requests per hour
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: "Too many OTP requests, please try again later",
        });
    },
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            error: "Too many requests, please try again later",
        });
    },
});
