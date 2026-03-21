export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    error?: string;
    data: T;
}

export interface BaseResponse {
    success: boolean;
    message?: string;
    error?: string;
}

export interface SearchResult<T> {
    data: T[];
    total: number;
}

export interface PaginatedResponse<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
}
