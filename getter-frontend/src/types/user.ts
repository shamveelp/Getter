export interface User {
    _id: string;
    username: string;
    email: string;
    name: string;
    isActive: boolean;
    isAdmin: boolean;
    tokenVersion: number;
    profilePicture?: string;
    bio?: string;
    phoneNumber?: string;
    isBanned: boolean;
    createdAt: string;
    updatedAt: string;
}
