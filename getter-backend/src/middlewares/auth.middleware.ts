import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtAccessPayload } from "../core/interfaces/services/IJWT.service";

export interface AuthRequest extends Request {
    user?: JwtAccessPayload;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token && req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
    }

    try {
        const secret = process.env.JWT_ACCESS_SECRET;
        if (!secret) throw new Error("JWT_ACCESS_SECRET is not defined in environment variables.");

        const verified = jwt.verify(token, secret) as JwtAccessPayload;

        // Fetch user to check ban status and token version
        const { UserModel } = await import("../models/user.model");
        const user = await UserModel.findById(verified.id).select('+tokenVersion +isBanned');

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found." });
        }

        if (user.isBanned) {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.clearCookie("user_role");
            return res.status(403).json({ success: false, message: "Account is banned." });
        }

        // Check if token version matches
        if (verified.tokenVersion !== undefined && user.tokenVersion !== verified.tokenVersion) {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.clearCookie("user_role");
            return res.status(401).json({ success: false, message: "Token is invalid (user logged out or banned elsewhere)." });
        }

        req.user = verified;
        next();
    } catch (err: unknown) {
        res.status(401).json({ success: false, message: "Invalid or Expired Token" });
    }
};
