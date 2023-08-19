export interface ApiResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    pages: number;
    results: T[];
}