import { IUser } from "../../../models/user.model";

export class AdminLoginDto {
    email?: string;
    password?: string;
}

export class AdminForgotPasswordDto {
    email?: string;
}

export class AdminResetPasswordDto {
    email?: string;
    newPassword?: string;
}

export class AdminLoginResponseDto {
    success: boolean = true;
    user: {
        _id: string;
        email: string;
        name: string;
        username: string;
        isAdmin: boolean;
    };
    message: string;

    constructor(user: IUser, message: string) {
        this.user = {
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            username: user.username,
            isAdmin: user.isAdmin
        };
        this.message = message;
    }
}
