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

export enum EventStatus {
    UPCOMING = 'upcoming',
    ONGOING = 'ongoing',
    ENDED = 'ended',
    CANCELLED = 'cancelled',
    UNLISTED = 'unlisted', // Hidden
}

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
}
