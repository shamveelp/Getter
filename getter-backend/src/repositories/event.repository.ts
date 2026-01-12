import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { IEvent, EventModel } from "../models/event.model";
import { IEventRepository } from "../core/interfaces/repositories/IEvent.repository";

@injectable()
export class EventRepository extends BaseRepository<IEvent> implements IEventRepository {
    constructor() {
        super(EventModel);
    }

    async search(query: any, options: any): Promise<{ data: IEvent[]; total: number }> {
        const skip = (options.page - 1) * options.limit;
        const data = await this._model.find(query).skip(skip).limit(options.limit).sort(options.sort).exec();
        const total = await this._model.countDocuments(query).exec();
        return { data, total };
    }
}
