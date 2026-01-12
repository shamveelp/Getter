import { injectable, inject } from "inversify";
import { TYPES } from "../core/types";
import { IEventRepository } from "../core/interfaces/repositories/IEvent.repository";
import { IEvent } from "../models/event.model";
import { EventStatus } from "../enums/business.enums";

@injectable()
export class EventService {
    constructor(
        @inject(TYPES.IEventRepository) private eventRepository: IEventRepository
    ) { }

    async createEvent(data: Partial<IEvent>): Promise<IEvent> {
        if (new Date(data.startDate!) > new Date(data.endDate!)) {
            throw new Error("End date must be after start date");
        }
        return this.eventRepository.create(data);
    }

    async updateEvent(id: string, data: Partial<IEvent>): Promise<IEvent | null> {
        return this.eventRepository.update(id, data);
    }

    async endEvent(id: string): Promise<IEvent | null> {
        return this.eventRepository.update(id, { status: EventStatus.ENDED });
    }

    async unlistEvent(id: string): Promise<IEvent | null> {
        return this.eventRepository.update(id, { status: EventStatus.UNLISTED });
    }

    async getEventById(id: string): Promise<IEvent | null> {
        return this.eventRepository.findById(id);
    }

    async getAllEvents(): Promise<IEvent[]> {
        return this.eventRepository.find({ isDeleted: false });
    }

    async searchEvents(filters: any): Promise<{ data: IEvent[]; total: number }> {
        const query: any = {
            status: { $in: [EventStatus.UPCOMING, EventStatus.ONGOING] },
            isDeleted: false
        };

        if (filters.keyword) {
            query.$text = { $search: filters.keyword };
        }
        if (filters.location) {
            query.location = { $regex: filters.location, $options: 'i' };
        }

        const options = {
            page: Number(filters.page) || 1,
            limit: Number(filters.limit) || 10,
            sort: filters.sort ? { [filters.sort]: -1 } : { startDate: 1 }
        };

        return this.eventRepository.search(query, options);
    }
}
