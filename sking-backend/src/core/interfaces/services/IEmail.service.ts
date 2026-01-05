export interface IEmailService {
    sendOtpEmail(email: string, otp: string): Promise<void>;
    sendForgotPasswordOtpEmail(email: string, otp: string): Promise<void>;
    sendWelcomeEmail(email: string, username: string): Promise<void>;
    sendPasswordResetSuccessEmail(email: string): Promise<void>;
}