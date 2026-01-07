import { injectable } from "inversify";
import { IUser, UserModel } from "../../models/user.model";
import { IAdminCustomerRepository } from "../../core/interfaces/repositories/admin/IAdminCustomer.repository";

@injectable()
export class AdminCustomerRepository implements IAdminCustomerRepository {
    async findAll(limit: number, skip: number, search?: string): Promise<{ users: IUser[]; total: number }> {
        // Filter for non-admin users (including those where isAdmin might be undefined)
        const filter: any = { isAdmin: { $ne: true } };

        if (search) {
            const searchRegex = new RegExp(search, "i");
            filter.$or = [
                { name: searchRegex },
                { username: searchRegex },
                { email: searchRegex }
            ];
        }

        const users = await UserModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await UserModel.countDocuments(filter);

        return { users, total };
    }

    async findById(id: string): Promise<IUser | null> {
        return await UserModel.findById(id);
    }

    async banUser(id: string): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            id,
            {
                isBanned: true,
                $inc: { tokenVersion: 1 } // Revoke all sessions by incrementing token version
            },
            { new: true }
        );
    }

    async unbanUser(id: string): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            id,
            { isBanned: false }, // Unban, no need to touch tokenVersion, user can just login again
            { new: true }
        );
    }
}
