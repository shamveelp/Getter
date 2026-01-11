import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "inversify";
import { IEmailService } from "../core/interfaces/services/IEmail.service";
import logger from "../utils/logger";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enums";

@injectable()
export class EmailService implements IEmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        this.verifyConnection();
    }

    private async verifyConnection(): Promise<void> {
        try {
            await this.transporter.verify();
            logger.info("📧 Email service connected successfully");
        } catch (error) {
            logger.error("❌ Email service connection failed:", error);
        }
    }

    async sendOtpEmail(email: string, otp: string): Promise<void> {
        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .otp-code { background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                    .otp-number { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>SKING COSMETICS</h1>
                        <p>Verify Your Email Address</p>
                    </div>
                    <div class="content">
                        <h2>Welcome to Getter!</h2>
                        <p>Thank you for registering with us. To complete your registration, please enter the following verification code:</p>
                        
                        <div class="otp-code">
                            <p>Your verification code is:</p>
                            <div class="otp-number">${otp}</div>
                        </div>
                        
                        <p><strong>This code will expire in 5 minutes.</strong></p>
                        <p>If you didn't create an account with Getter, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Getter. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(
            email,
            "Verify Your Getter Account",
            `Your verification code is: ${otp}`,
            htmlTemplate
        );
    }

    async sendForgotPasswordOtpEmail(email: string, otp: string): Promise<void> {
        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .otp-code { background-color: #fff5f5; border: 2px dashed #ff6b6b; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                    .otp-number { font-size: 32px; font-weight: bold; color: #ff6b6b; letter-spacing: 8px; }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>SKING COSMETICS</h1>
                        <p>Password Reset Request</p>
                    </div>
                    <div class="content">
                        <h2>Reset Your Password</h2>
                        <p>You have requested to reset your password. Please enter the following verification code to proceed:</p>
                        
                        <div class="otp-code">
                            <p>Your reset code is:</p>
                            <div class="otp-number">${otp}</div>
                        </div>
                        
                        <p><strong>This code will expire in 5 minutes.</strong></p>
                        <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Getter. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(
            email,
            "Reset Your Getter Password",
            `Your password reset code is: ${otp}`,
            htmlTemplate
        );
    }

    async sendWelcomeEmail(email: string, username: string): Promise<void> {
        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>SKING COSMETICS</h1>
                        <p>Welcome to Our Beauty Community!</p>
                    </div>
                    <div class="content">
                        <h2>Welcome ${username}!</h2>
                        <p>Congratulations! Your Getter account has been successfully created.</p>
                        <p>You're now part of our exclusive beauty community where luxury meets innovation.</p>
                        <p>Get ready to discover our curated collection of premium skincare products designed to enhance your natural beauty.</p>
                        <p>Start exploring and enjoy your journey with us!</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Getter. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(
            email,
            "Welcome to Getter!",
            `Welcome ${username}! Your account has been created successfully.`,
            htmlTemplate
        );
    }

    async sendPasswordResetSuccessEmail(email: string): Promise<void> {
        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>SKING COSMETICS</h1>
                        <p>Password Reset Successful</p>
                    </div>
                    <div class="content">
                        <h2>Password Updated Successfully</h2>
                        <p>Your password has been successfully updated.</p>
                        <p>If you didn't make this change, please contact our support team immediately.</p>
                        <p>For your security, we recommend using a strong, unique password.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Getter. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail(
            email,
            "Password Reset Successful - Getter",
            "Your password has been successfully updated.",
            htmlTemplate
        );
    }

    private async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: {
                    name: process.env.FROM_NAME || "Getter",
                    address: process.env.FROM_EMAIL || process.env.SMTP_USER || "",
                },
                to,
                subject,
                text,
                html,
            });

            logger.info(`📧 Email sent successfully to ${to}`);
        } catch (error: any) {
            logger.error("❌ Failed to send email:", error);

            if (error.responseCode === 535) {
                logger.error("🔐 SMTP Authentication Error: Username and Password not accepted.");
                logger.error("💡 TIP: If you are using Gmail, you MUST use an 'App Password' instead of your regular password.");
                logger.error("   1. Go to Google Account > Security");
                logger.error("   2. Enable 2-Step Verification");
                logger.error("   3. Go to 'App passwords' (search for it in the search bar)");
                logger.error("   4. Generate a new password and use it in your .env file as SMTP_PASS");
            }

            throw new CustomError("Failed to send email", StatusCode.INTERNAL_SERVER_ERROR);
        }
    }
}