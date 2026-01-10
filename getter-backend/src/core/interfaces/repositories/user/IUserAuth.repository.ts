import { IBaseRepository } from "../IBase.repository";
import { IUser } from "../../../../models/user.model";

export interface IUserAuthRepository extends IBaseRepository<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
    findByUsername(username: string): Promise<IUser | null>;
}
