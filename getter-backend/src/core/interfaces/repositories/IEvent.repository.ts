import { IBaseRepository } from "./IBase.repository";
import { IEvent } from "../../../models/event.model";

export interface IEventRepository extends IBaseRepository<IEvent> {
    search(query: any, options: any): Promise<{ data: IEvent[]; total: number }>;
}
