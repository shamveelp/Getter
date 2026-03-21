export enum ServiceCategory {
    VENUE = 'venue',
    CATERER = 'caterer',
    DJ = 'dj',
    PHOTOGRAPHER = 'photographer',
    DECORATION = 'decoration',
    OTHER = 'other',
}

export enum ServiceStatus {
    ACTIVE = 'active',
    UNLISTED = 'unlisted',
    ENDED = 'ended',
}

export interface ServiceAvailability {
    type: 'specific_dates' | 'recurring';
    recurring?: {
        days: string[];
        startTime: string;
        endTime: string;
        is24Hours?: boolean;
    };
    specificDates?: { startDate: string | Date; endDate: string | Date }[];
}

export interface Service {
    _id: string;
    title: string;
    category: ServiceCategory;
    pricePerDay: number;
    description: string;
    location: string;
    images: string[];
    availability: ServiceAvailability;
    contact: { email: string; phone: string };
    totalUnits: number;
    status: ServiceStatus;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceFilters {
    keyword?: string;
    category?: string;
    minPrice?: number | string;
    maxPrice?: number | string;
    location?: string;
    sort?: string;
    page?: number;
    limit?: number;
    status?: ServiceStatus;
}
