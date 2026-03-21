import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { IService, ServiceModel } from "../models/service.model";
import { IServiceRepository } from "../core/interfaces/repositories/IService.repository";

@injectable()
export class ServiceRepository extends BaseRepository<IService> implements IServiceRepository {
    constructor() {
        super(ServiceModel);
    }

    async search(query: Record<string, unknown>, options: Record<string, unknown>): Promise<{ data: IService[]; total: number }> {
        // Implementation using find with pagination
        const opt = options as { page: number; limit: number; sort?: Record<string, number> };
        const skip = (opt.page - 1) * opt.limit;
        const data = await this._model.find(query).skip(skip).limit(opt.limit).sort(opt.sort as any).exec();
        const total = await this._model.countDocuments(query).exec();
        return { data, total };
    }
}
