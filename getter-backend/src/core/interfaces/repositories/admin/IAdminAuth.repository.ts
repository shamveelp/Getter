import { IBaseRepository } from "../IBase.repository";
import { IUser } from "../../../../models/user.model";

export interface IAdminAuthRepository extends IBaseRepository<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
}
