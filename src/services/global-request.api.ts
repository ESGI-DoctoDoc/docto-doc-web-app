import {RequestBuilder} from "~/api/request-builder";


export const useGlobalRequestApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`

    function deleteByPath(path: string) {
        return new RequestBuilder(BASE_API_URL)
            .delete(path)
            .execute()
    }

    return {
        deleteByPath,
    }
}