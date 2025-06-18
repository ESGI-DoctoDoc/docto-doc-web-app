import {RequestBuilder} from '~/api/request-builder';
import {
    type CareTracking,
    careTrackingSchema,
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

export const careTrackingApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`;

    function fetchCareTracking() {
        return new RequestBuilder(BASE_API_URL)
            .get('/doctors/care-tracking')
            .withResponse<GetCareTrackingsResponse>(getCareTrackingsResponseSchema)
            .execute();
    }

    function fetchCareTrackingById(id: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/doctors/care-tracking/${id}`)
            .withResponse<CareTracking>(careTrackingSchema)
            .execute();
    }

    function createCareTracking(requestDto: CreateCareTrackingDto) {
        return new RequestBuilder(BASE_API_URL)
            .post('/doctors/care-trackings')
            .withBody<CreateCareTrackingBody>(createCareTrackingBodySchema)
            .execute({
                body: {
                    name: requestDto.name,
                    patient: requestDto.patientId,
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

