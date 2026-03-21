export interface BookingEmailDetails {
    totalPrice: number;
    status: string;
    type: string;
    title: string;
}

export interface IEmailService {
    sendOtpEmail(email: string, otp: string): Promise<void>;
    sendForgotPasswordOtpEmail(email: string, otp: string): Promise<void>;
    sendWelcomeEmail(email: string, username: string): Promise<void>;
    sendPasswordResetSuccessEmail(email: string): Promise<void>;
    sendBookingConfirmation(email: string, bookingDetails: BookingEmailDetails): Promise<void>;
}