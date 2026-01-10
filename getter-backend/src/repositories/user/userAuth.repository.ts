import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { IUserAuthRepository } from "../../core/interfaces/repositories/user/IUserAuth.repository";
import { IUser, UserModel } from "../../models/user.model";

@injectable()
export class UserAuthRepository extends BaseRepository<IUser> implements IUserAuthRepository {
    constructor() {
        super(UserModel);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return this.findOne({ email });
    }

    async findByUsername(username: string): Promise<IUser | null> {
        return this.findOne({ username });
    }
}
