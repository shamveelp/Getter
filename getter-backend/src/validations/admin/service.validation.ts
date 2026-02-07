import { z } from "zod";
import { ServiceCategory } from "../../enums/business.enums";

export const CreateServiceSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    category: z.nativeEnum(ServiceCategory),
    pricePerDay: z.number().min(0, "Price must be positive"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    location: z.string().min(3, "Location is required"),
    images: z.array(z.string()).optional(),
    totalUnits: z.number().min(1, "At least 1 unit is required").default(1),
    availability: z.object({
        type: z.enum(['specific_dates', 'recurring']).default('recurring'),
        recurring: z.object({
            days: z.array(z.string()),
            startTime: z.string().optional(),
            endTime: z.string().optional(),
            is24Hours: z.boolean().default(false),
        }).optional(),
        specificDates: z.array(z.object({
            startDate: z.string().or(z.date()),
            endDate: z.string().or(z.date()),
        })).optional(),
    }),
    contact: z.object({
        email: z.string().email("Invalid contact email"),
        phone: z.string().min(10, "Invalid contact phone number"),
    }),
});

export const UpdateServiceSchema = CreateServiceSchema.partial();
