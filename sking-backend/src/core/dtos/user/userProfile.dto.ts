export class UpdateProfileDto {
    name?: string;
    bio?: string;
    phoneNumber?: string;
}

export class UploadProfilePictureDto {
    image?: Buffer;
}

export class ProfileResponseDto {
    user: {
        _id: string;
        username: string;
        email: string;
        name: string;
        bio?: string;
        phoneNumber?: string;
        profilePicture?: string;
    };
    success: boolean = true;

    constructor(user: any) {
        this.user = {
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            name: user.name,
            bio: user.bio,
            phoneNumber: user.phoneNumber,
            profilePicture: user.profilePicture
        };
    }
}
