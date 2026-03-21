import mongoose, { Document, Model } from "mongoose";
import { injectable, unmanaged } from "inversify";
import { IBaseRepository } from "../core/interfaces/repositories/IBase.repository";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enums";

@injectable()
export class BaseRepository<T extends Document> implements IBaseRepository<T> {
    protected readonly _model: Model<T>;

    constructor(@unmanaged() model: Model<T>) {
        this._model = model;
    }

    async create(data: Partial<T>): Promise<T> {
        try {
            const createdItem = new this._model(data);
            return await createdItem.save();
        } catch (error: unknown) {
            throw new CustomError(`Database Error: ${(error as Error).message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async findById(id: string): Promise<T | null> {
        try {
            return await this._model.findById(id).exec();
        } catch (error: unknown) {
            throw new CustomError(`Database Error: ${(error as Error).message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(filter: Record<string, unknown>): Promise<T | null> {
        try {
            return await this._model.findOne(filter).exec();
        } catch (error: unknown) {
            throw new CustomError(`Database Error: ${(error as Error).message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async find(filter: Record<string, unknown> = {}, options?: Record<string, unknown>): Promise<T[]> {
        try {
            return await this._model.find(filter, null, options).exec();
        } catch (error: unknown) {
            throw new CustomError(`Database Error: ${(error as Error).message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id: string, update: Record<string, unknown>): Promise<T | null> {
        try {
            return await this._model.findByIdAndUpdate(id, update, { new: true }).exec();
        } catch (error: unknown) {
            throw new CustomError(`Database Error: ${(error as Error).message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async updateOne(filter: Record<string, unknown>, update: Record<string, unknown>): Promise<T | null> {
        try {
            return await this._model.findOneAndUpdate(filter, update, { new: true }).exec();
        } catch (error: unknown) {
            throw new CustomError(`Database Error: ${(error as Error).message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: string): Promise<T | null> {
        try {
            return await this._model.findByIdAndDelete(id).exec();
        } catch (error: unknown) {
            throw new CustomError(`Database Error: ${(error as Error).message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async count(filter: Record<string, unknown> = {}): Promise<number> {
        try {
            return await this._model.countDocuments(filter).exec();
        } catch (error: unknown) {
            throw new CustomError(`Database Error: ${(error as Error).message}`, StatusCode.INTERNAL_SERVER_ERROR);
        }
    }
}
