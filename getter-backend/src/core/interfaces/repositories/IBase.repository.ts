import { Document } from "mongoose";

export interface IBaseRepository<T extends Document> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(filter: Record<string, unknown>): Promise<T | null>;
    find(filter: Record<string, unknown>, options?: Record<string, unknown>): Promise<T[]>;
    update(id: string, update: Record<string, unknown>): Promise<T | null>;
    updateOne(filter: Record<string, unknown>, update: Record<string, unknown>): Promise<T | null>;
    delete(id: string): Promise<T | null>;
    count(filter?: Record<string, unknown>): Promise<number>;
}

