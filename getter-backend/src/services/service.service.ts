import { injectable, inject } from "inversify";
import { TYPES } from "../core/types";
import { IServiceRepository } from "../core/interfaces/repositories/IService.repository";
import { IService } from "../models/service.model";
import { ServiceStatus } from "../enums/business.enums";
import { CreateServiceSchema, UpdateServiceSchema } from "../validations/admin/service.validation";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enums";

@injectable()
export class ServiceService {
    constructor(
        @inject(TYPES.IServiceRepository) private serviceRepository: IServiceRepository
    ) { }

    async createService(data: any): Promise<IService> {
        // Zod Validation
        const validated = CreateServiceSchema.safeParse(data);

        if (!validated.success) {
            const errorMessages = validated.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(", ");
            throw new CustomError(`Validation Error: ${errorMessages}`, StatusCode.BAD_REQUEST);
        }

        const validData = validated.data;

        if (validData.availability?.type === 'specific_dates' && validData.availability.specificDates) {
            validData.availability.specificDates.forEach(slot => {
                if (new Date(slot.startDate) > new Date(slot.endDate)) {
                    throw new CustomError("Invalid availability dates: Start date cannot be after end date.", StatusCode.BAD_REQUEST);
                }
            });
        }

        return this.serviceRepository.create(validData as any);
    }

    async updateService(id: string, data: any): Promise<IService | null> {
        const validated = UpdateServiceSchema.safeParse(data);
        if (!validated.success) {
            const errorMessages = validated.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(", ");
            throw new CustomError(`Validation Error: ${errorMessages}`, StatusCode.BAD_REQUEST);
        }
        return this.serviceRepository.update(id, validated.data as any);
    }

    async unlistService(id: string): Promise<IService | null> {
        return this.serviceRepository.update(id, { status: ServiceStatus.UNLISTED } as any);
    }

    async listService(id: string): Promise<IService | null> {
        return this.serviceRepository.update(id, { status: ServiceStatus.ACTIVE } as any);
    }

    async deleteService(id: string): Promise<IService | null> {
        // Soft delete
        return this.serviceRepository.update(id, { isDeleted: true, status: ServiceStatus.UNLISTED } as any);
    }

    async getServiceById(id: string): Promise<IService | null> {
        return this.serviceRepository.findById(id);
    }

    async getAllServices(): Promise<IService[]> {
        return this.serviceRepository.find({ isDeleted: false });
    }

    async searchServices(filters: any): Promise<{ data: IService[]; total: number }> {
        const query: any = { isDeleted: false };

        if (filters.status) {
            if (filters.status !== 'all') {
                query.status = filters.status;
            }
        } else {
            query.status = ServiceStatus.ACTIVE;
        }

        if (filters.keyword) {
            query.$or = [
                { title: { $regex: filters.keyword, $options: 'i' } },
                { location: { $regex: filters.keyword, $options: 'i' } }
            ];
        }
        if (filters.category) {
            query.category = filters.category;
        }
        if (filters.minPrice || filters.maxPrice) {
            query.pricePerDay = {};
            if (filters.minPrice) query.pricePerDay.$gte = Number(filters.minPrice);
            if (filters.maxPrice) query.pricePerDay.$lte = Number(filters.maxPrice);
        }
        if (filters.location) {
            query.location = { $regex: filters.location, $options: 'i' };
        }

        const options = {
            page: Number(filters.page) || 1,
            limit: Number(filters.limit) || 10,
            sort: filters.sort ? { [filters.sort.split(':')[0]]: filters.sort.split(':')[1] === 'desc' ? -1 : 1 } : { createdAt: -1 }
        };

        return this.serviceRepository.search(query, options);
    }
}
