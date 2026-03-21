import { IBaseRepository } from "./IBase.repository";
import { IService } from "../../../models/service.model";

export interface IServiceRepository extends IBaseRepository<IService> {
    // Add specific methods if needed, e.g. search with aggregation
    search(query: Record<string, unknown>, options: Record<string, unknown>): Promise<{ data: IService[]; total: number }>;
}
