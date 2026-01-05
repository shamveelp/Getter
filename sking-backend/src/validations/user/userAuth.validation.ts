import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters long").max(30, "Username must be less than 30 characters"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(8, "Password must be at least 8 characters long").max(128, "Password must be less than 128 characters"),
        name: z.string().optional(),
        referralCode: z.string().optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, "Password is required"),
    }),
});

export const checkUsernameSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters long").max(30, "Username must be less than 30 characters"),
    }),
});

export const checkEmailSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
    }),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        newPassword: z.string().min(8, "Password must be at least 8 characters long").max(128, "Password must be less than 128 characters"),
    }),
});

export const verifyOtpSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters long").max(30, "Username must be less than 30 characters"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(8, "Password must be at least 8 characters long").max(128, "Password must be less than 128 characters"),
        name: z.string().optional(),
        otp: z.string().length(6, "OTP must be 6 digits"),
        referralCode: z.string().optional(),
    }),
});



