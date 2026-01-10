import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { IAdminAuthRepository } from "../../core/interfaces/repositories/admin/IAdminAuth.repository";
import { IUser, UserModel } from "../../models/user.model";

@injectable()
export class AdminAuthRepository extends BaseRepository<IUser> implements IAdminAuthRepository {
    constructor() {
        super(UserModel);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return this.findOne({ email });
    }
}
