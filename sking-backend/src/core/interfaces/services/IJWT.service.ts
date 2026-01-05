import { Response } from "express";

export interface JwtAccessPayload {
    id: string;
    role: string;
    tokenVersion: number;
}

export interface JwtRefreshPayload {
    id: string;
    role: string;
    tokenVersion: number;
}

export interface IJwtService {
    generateAccessToken(id: string, role: string, tokenVersion: number): string;
    generateRefreshToken(id: string, role: string, tokenVersion: number): string;
    verifyAccessToken(token: string): JwtAccessPayload;
    verifyRefreshToken(token: string): JwtRefreshPayload;
    setTokens(res: Response, accessToken: string, refreshToken: string): void;
    clearTokens(res: Response): void;
}
