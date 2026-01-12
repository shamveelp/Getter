import mongoose, { Schema, Document, Model } from "mongoose";
import { ServiceCategory, ServiceStatus } from "../enums/business.enums";

export interface IService extends Document {
    title: string;
    category: ServiceCategory;
    pricePerDay: number;
    description: string;
    location: string;
    images: string[];
    availability: { startDate: Date; endDate: Date }[];
    contact: { email: string; phone: string };
    status: ServiceStatus;
    isDeleted: boolean; // Accessible only by admin if true? Or maybe just status=UNLISTED
    createdAt: Date;
    updatedAt: Date;
}

const ServiceSchema: Schema<IService> = new Schema(
    {
        title: { type: String, required: true },
        category: { type: String, enum: Object.values(ServiceCategory), required: true },
        pricePerDay: { type: Number, required: true, min: 0 },
        description: { type: String, required: true },
        location: { type: String, required: true },
        images: [{ type: String }],
        availability: [
            {
                startDate: { type: Date, required: true },
                endDate: { type: Date, required: true },
            },
        ],
        contact: {
            email: { type: String, required: true },
            phone: { type: String, required: true },
        },
        status: { type: String, enum: Object.values(ServiceStatus), default: ServiceStatus.ACTIVE },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Indexes for search
ServiceSchema.index({ title: 'text', description: 'text', location: 'text' });
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ pricePerDay: 1 });
ServiceSchema.index({ status: 1 });

export const ServiceModel: Model<IService> = mongoose.model<IService>("Service", ServiceSchema);
