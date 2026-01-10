import { z } from "zod";

export const adminLoginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, "Password is required"),
    }),
});

export const adminForgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
    }),
});

export const adminResetPasswordSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        newPassword: z.string().min(8, "Password must be at least 8 characters long").max(128, "Password must be less than 128 characters"),
    }),
});
