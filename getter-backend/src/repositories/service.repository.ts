import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { IService, ServiceModel } from "../models/service.model";
import { IServiceRepository } from "../core/interfaces/repositories/IService.repository";

@injectable()
export class ServiceRepository extends BaseRepository<IService> implements IServiceRepository {
    constructor() {
        super(ServiceModel);
    }

    async search(query: any, options: any): Promise<{ data: IService[]; total: number }> {
        // Implementation using find with pagination
        const skip = (options.page - 1) * options.limit;
        const data = await this._model.find(query).skip(skip).limit(options.limit).sort(options.sort).exec();
        const total = await this._model.countDocuments(query).exec();
        return { data, total };
    }
}
