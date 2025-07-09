import {string} from "zod"

export const useDeeplink = () => {
    const route = useRoute()
    const router = useRouter()

    function retrieveDeeplinkId(): string | null {
        const deeplinkId = route.query.id as string | undefined
        if (!deeplinkId) {
            return null
        }

        const isValidId = string().uuid().safeParse(deeplinkId).success
        return isValidId ? deeplinkId : null
    }

    function resetDeeplink() {
        if (Object.values(route.query).length === 0) {
            return;
        }
        return router.replace({path: route.path, query: {}})
    }

    function navigateToResource(path: string, id: string) {
        const isValidId = string().safeParse(id).success
        if (!isValidId) {
            console.error(`Invalid ID: ${id}`)
            return
        }

        return router.push({path, query: {id}})
    }

    function navigateToResourceWithFilter(path: string, filter: Record<string, string>) {
        const query = Object.fromEntries(Object.entries(filter).filter(([_, value]) => {
            return value !== undefined && value !== null && value !== 'undefined' && value !== 'null';
        }))
        return router.push({path, query})
    }

    function retrieveDeeplinkFilter(): { hasFilter: boolean, filter: Record<string, string> } {
        const query = route.query
        const filter: Record<string, string> = {}
        for (const [key, value] of Object.entries(query)) {
            if (typeof value === 'string' && value.trim() !== '') {
                filter[key] = value
            }
        }
        return {
            hasFilter: Object.keys(filter).length > 0,
            filter
        }
    }

    function filterDeeplinkToQuery(filter: Record<string, string>): string {
        return Object.entries(filter)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&')
    }

    return {
        retrieveDeeplinkId,
        resetDeeplink,
        navigateToResource,
        navigateToResourceWithFilter,
        retrieveDeeplinkFilter,
        filterDeeplinkToQuery,
    }
}