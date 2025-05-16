import {useSession} from "~/composables/auth/useSession";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type ApiRequestBody = Record<string, unknown> | BodyInit | null | undefined;

interface ApiResponse<T> {
    data: T;
    success: boolean;
    errorCode: string;
}

interface RequestOptions<T extends ApiRequestBody> {
    method: HttpMethod;
    path: string;
    body?: T;
    query?: Record<string, unknown>;
}

export class ApiClient {
    private getAuthHeaders(): HeadersInit {
        const {getToken} = useSession();
        const token = getToken();

        return token
            ? { Authorization: `Bearer ${token}` }
            : {};
    }

    async request<TResponse, TBody extends ApiRequestBody = undefined>(
        options: RequestOptions<TBody>
    ): Promise<ApiResponse<TResponse>> {
        const { method, path, body, query } = options;

        try {
            const response = await $fetch<ApiResponse<TResponse>>(path, {
                method,
                headers: this.getAuthHeaders(),
                body,
                query,
            });

            console.group()
            console.debug('Requête réussie :', method, path);
            console.debug('Corps de la requête :', body);
            console.groupEnd();
            return response;
        } catch (error) {
            console.group()
            console.error('Erreur lors de la requête :', method, path);
            console.error(error);
            console.groupEnd()
            throw error;
        }
    }

    get<T>(path: string, query?: Record<string, never>) {
        return this.request<T>({
            method: 'GET',
            path,
            query,
        });
    }

    async post<T, TBody extends ApiRequestBody>(path: string, body: TBody) {
        return this.request<T, TBody>({
            method: 'POST',
            path,
            body,
        }).then(response => {
            if (response.success) {
                console.debug(`POST ${path} successful. Data: `, response.data);
                return response.data;
            } else {
                throw new Error(response.errorCode);
            }
        })
    }

    put<T, TBody extends ApiRequestBody>(path: string, body: TBody) {
        return this.request<T, TBody>({
            method: 'PUT',
            path,
            body,
        });
    }

    delete<T>(path: string) {
        return this.request<T>({
            method: 'DELETE',
            path,
        });
    }
}