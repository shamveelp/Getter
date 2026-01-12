import mongoose, { Schema, Document, Model } from "mongoose";
import { EventStatus } from "../enums/business.enums";

export interface IEvent extends Document {
    title: string;
    description: string;
    location: string;
    startDate: Date;
    endDate: Date;
    services: mongoose.Types.ObjectId[];
    price: number;
    status: EventStatus;
    images: string[];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema: Schema<IEvent> = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        location: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
        price: { type: Number, default: 0 },
        status: { type: String, enum: Object.values(EventStatus), default: EventStatus.UPCOMING },
        images: [{ type: String }],
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Indexes
EventSchema.index({ title: 'text', description: 'text', location: 'text' });
EventSchema.index({ startDate: 1 });
EventSchema.index({ status: 1 });

export const EventModel: Model<IEvent> = mongoose.model<IEvent>("Event", EventSchema);
