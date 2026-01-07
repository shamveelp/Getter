import { IUser } from "../../../../models/user.model";
import { AdminCustomerListResponseDto, AdminCustomerDetailResponseDto } from "../../../dtos/admin/adminCustomer.dto";

export interface IAdminCustomerService {
    getAllUsers(page: number, limit: number): Promise<AdminCustomerListResponseDto>;
    getUserById(id: string): Promise<AdminCustomerDetailResponseDto>;
    banUser(id: string): Promise<void>;
    unbanUser(id: string): Promise<void>;
}
