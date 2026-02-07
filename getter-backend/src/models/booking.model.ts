import mongoose, { Schema, Document, Model } from "mongoose";
import { BookingStatus } from "../enums/business.enums";

export interface IBooking extends Document {
    user: mongoose.Types.ObjectId;
    service?: mongoose.Types.ObjectId;
    startDate?: Date; // For service booking (start of range or first selected date)
    endDate?: Date;   // For service booking (end of range or last selected date)
    selectedDates?: Date[]; // For discrete day bookings
    totalPrice: number;
    status: BookingStatus;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema<IBooking> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        service: { type: Schema.Types.ObjectId, ref: "Service" },
        startDate: { type: Date },
        endDate: { type: Date },
        selectedDates: [{ type: Date }],
        totalPrice: { type: Number, required: true },
        status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING },
    },
    { timestamps: true }
);

BookingSchema.index({ user: 1 });
BookingSchema.index({ service: 1 });

export const BookingModel: Model<IBooking> = mongoose.model<IBooking>("Booking", BookingSchema);
