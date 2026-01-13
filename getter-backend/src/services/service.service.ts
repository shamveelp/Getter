import { injectable, inject } from "inversify";
import { TYPES } from "../core/types";
import { IServiceRepository } from "../core/interfaces/repositories/IService.repository";
import { IService } from "../models/service.model";
import { ServiceStatus } from "../enums/business.enums";

@injectable()
export class ServiceService {
    constructor(
        @inject(TYPES.IServiceRepository) private serviceRepository: IServiceRepository
    ) { }

    async createService(data: Partial<IService>): Promise<IService> {
        // Validation
        if ((data.pricePerDay || 0) < 0) {
            throw new Error("Price must be positive");
        }
        // ensure availability dates are valid? (startDate < endDate)
        if (data.availability) {
            data.availability.forEach(slot => {
                if (new Date(slot.startDate) > new Date(slot.endDate)) {
                    throw new Error("Invalid availability dates");
                }
            });
        }

        return this.serviceRepository.create(data);
    }

    async updateService(id: string, data: Partial<IService>): Promise<IService | null> {
        return this.serviceRepository.update(id, data);
    }

    async unlistService(id: string): Promise<IService | null> {
        return this.serviceRepository.update(id, { status: ServiceStatus.UNLISTED });
    }

    async deleteService(id: string): Promise<IService | null> {
        // Soft delete
        return this.serviceRepository.update(id, { isDeleted: true, status: ServiceStatus.UNLISTED });
    }

    async getServiceById(id: string): Promise<IService | null> {
        return this.serviceRepository.findById(id);
    }

    async getAllServices(): Promise<IService[]> {
        return this.serviceRepository.find({ isDeleted: false });
    }

    async searchServices(filters: any): Promise<{ data: IService[]; total: number }> {
        const query: any = { status: ServiceStatus.ACTIVE, isDeleted: false };

        if (filters.keyword) {
            // Search by title OR location if keyword is provided
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
            // Specific location filter (in addition to keyword search)
            query.location = { $regex: filters.location, $options: 'i' };
        }
        // Date availability logic is complex (exclude if booking exists), standard search usually checks if service *declares* it is available.
        // For now, let's assume availability matches the defined slots.

        const options = {
            page: Number(filters.page) || 1,
            limit: Number(filters.limit) || 10,
            sort: filters.sort ? { [filters.sort.split(':')[0]]: filters.sort.split(':')[1] === 'desc' ? -1 : 1 } : { createdAt: -1 }
        };

        return this.serviceRepository.search(query, options);
    }
}
