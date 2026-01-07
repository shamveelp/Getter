import { IUser } from "../../../../models/user.model";

export interface IAdminCustomerRepository {
    findAll(limit: number, skip: number): Promise<{ users: IUser[], total: number }>;
    findById(id: string): Promise<IUser | null>;
    banUser(id: string): Promise<IUser | null>;
    unbanUser(id: string): Promise<IUser | null>;
}
