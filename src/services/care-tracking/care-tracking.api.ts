import {RequestBuilder} from '~/api/request-builder';
import {
    type GetCareTrackingByIdResponse,
    getCareTrackingByIdResponseSchema,
    type GetCareTrackingDto,
    type GetCareTrackingsQuery,
    getCareTrackingsQuerySchema,
    type GetCareTrackingsResponse,
    getCareTrackingsResponseSchema
} from './dto/get-care-tracking.dto';
import {
    type CreateCareTrackingBody,
    createCareTrackingBodySchema,
    type CreateCareTrackingDto,
    type UpdateCareTrackingBody,
    updateCareTrackingBodySchema,
    type UpdateCareTrackingDto
} from './dto/create-care-tracking.dto';
import type {AppPagination} from "~/api/app-pagination.type";

export const careTrackingApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`;

    function fetchCareTracking(requestDto: AppPagination<GetCareTrackingDto>) {
        return new RequestBuilder(BASE_API_URL)
            .get('/doctors/care-tracking')
            .withQuery<GetCareTrackingsQuery>(getCareTrackingsQuerySchema)
            .withResponse<GetCareTrackingsResponse>(getCareTrackingsResponseSchema)
            .execute({
                query: {
                    page: requestDto.page,
                    size: requestDto.size
                }
            });
    }

    function fetchCareTrackingById(id: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/doctors/care-tracking/${id}`)
            .withResponse<GetCareTrackingByIdResponse>(getCareTrackingByIdResponseSchema)
            .execute();
    }

    function createCareTracking(requestDto: CreateCareTrackingDto) {
        return new RequestBuilder(BASE_API_URL)
            .post('/doctors/care-trackings')
            .withBody<CreateCareTrackingBody>(createCareTrackingBodySchema)
            .execute({
                body: {
                    name: requestDto.name,
                    description: requestDto.description,
                    patientId: requestDto.patientId,
                }
            });
    }

    function updateCareTracking(requestDto: UpdateCareTrackingDto) {
        return new RequestBuilder(BASE_API_URL)
            .put(`/doctors/care-tracking/${requestDto.id}`)
            .withBody<UpdateCareTrackingBody>(updateCareTrackingBodySchema)
            .execute({
                body: {
                    name: requestDto.name,
                    description: requestDto.description,
                }
            });
    }

    function removeCareTracking(id: string) {
        return new RequestBuilder(BASE_API_URL)
            .delete(`/doctors/care-tracking/${id}`)
            .execute();
    }

    return {
        fetchCareTracking,
        fetchCareTrackingById,
        createCareTracking,
        updateCareTracking,
        removeCareTracking,
    };
};

