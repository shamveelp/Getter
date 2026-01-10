import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminCustomerService } from "../../core/interfaces/services/admin/IAdminCustomer.service";
import { IAdminCustomerRepository } from "../../core/interfaces/repositories/admin/IAdminCustomer.repository";
import { AdminCustomerListResponseDto, AdminCustomerDetailResponseDto } from "../../core/dtos/admin/adminCustomer.dto";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";

@injectable()
export class AdminCustomerService implements IAdminCustomerService {
    constructor(
        @inject(TYPES.IAdminCustomerRepository) private _adminCustomerRepository: IAdminCustomerRepository
    ) { }

    async getAllUsers(page: number, limit: number, search?: string): Promise<AdminCustomerListResponseDto> {
        const skip = (page - 1) * limit;
        const { users, total } = await this._adminCustomerRepository.findAll(limit, skip, search);

        return new AdminCustomerListResponseDto(users, total, page, limit);
    }

    async getUserById(id: string): Promise<AdminCustomerDetailResponseDto> {
        const user = await this._adminCustomerRepository.findById(id);
        if (!user) {
            throw new CustomError("User not found", StatusCode.NOT_FOUND);
        }
        return new AdminCustomerDetailResponseDto(user);
    }

    async banUser(id: string): Promise<void> {
        const user = await this._adminCustomerRepository.findById(id);
        if (!user) {
            throw new CustomError("User not found", StatusCode.NOT_FOUND);
        }

        // Prevent banning other admins if we ever list them
        if (user.isAdmin) {
            throw new CustomError("Cannot ban an admin", StatusCode.FORBIDDEN);
        }

        await this._adminCustomerRepository.banUser(id);
    }

    async unbanUser(id: string): Promise<void> {
        const user = await this._adminCustomerRepository.findById(id);
        if (!user) {
            throw new CustomError("User not found", StatusCode.NOT_FOUND);
        }

        await this._adminCustomerRepository.unbanUser(id);
    }
}
