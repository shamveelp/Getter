import { Document } from "mongoose";

export interface IBaseRepository<T extends Document> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(filter: any): Promise<T | null>;
    find(filter: any, options?: any): Promise<T[]>;
    update(id: string, update: any): Promise<T | null>;
    updateOne(filter: any, update: any): Promise<T | null>;
    delete(id: string): Promise<T | null>;
    count(filter?: any): Promise<number>;
}

