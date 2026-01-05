import { IUser } from "../../../models/user.model";

export class UserRegisterDto {
    username?: string;
    email?: string;
    password?: string;
    name?: string;
    referralCode?: string;
}

export class UserLoginDto {
    email?: string;
    password?: string;
}

export class VerifyOtpDto {
    username?: string;
    email?: string;
    password?: string;
    name?: string;
    otp?: string;
    referralCode?: string;
}

export class CheckUsernameDto {
    username?: string;
}

export class CheckEmailDto {
    email?: string;
}

export class ForgotPasswordDto {
    email?: string;
}

export class ResetPasswordDto {
    email?: string;
    newPassword?: string;
}

export class RequestOtpDto {
    email?: string;
}

export class GoogleLoginDto {
    token?: string;
    referralCode?: string;
}

export class LoginResponseDto {
    success: boolean = true;
    user: {
        _id: string;
        email: string;
        name: string;
        username: string;
    };
    message: string;

    constructor(user: IUser, message: string) {
        this.user = {
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            username: user.username
        };
        this.message = message;
    }
}

export class RegisterResponseDto {
    success: boolean = true;
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}

export class UsernameCheckResponseDto {
    success: boolean = true;
    isAvailable: boolean;

    constructor(isAvailable: boolean) {
        this.isAvailable = isAvailable;
    }
}

export class EmailCheckResponseDto {
    success: boolean = true;
    isAvailable: boolean;

    constructor(isAvailable: boolean) {
        this.isAvailable = isAvailable;
    }
}