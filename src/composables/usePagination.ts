import type {AppPagination} from "~/api/app-pagination.type";

const currentPage = ref(0)
const defaultSize = 10

function nextPage<T>(request: (params: AppPagination<unknown>) => Promise<T[]>): Promise<T[]> {
    currentPage.value += 1
    return request({page: currentPage.value, size: defaultSize})
}

function resetPagination() {
    currentPage.value = 0
}

export function usePagination() {
    return {
        currentPage,
        defaultSize,
        nextPage,
        resetPagination,
    }
}