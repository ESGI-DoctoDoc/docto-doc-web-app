export type AppPagination<T> = {
    size?: number;
    page?: number;
} & T