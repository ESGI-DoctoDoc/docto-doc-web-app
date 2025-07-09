import {RequestBuilder} from '~/api/request-builder';
import {
    type GetCareTrackingByIdResponse,
    getCareTrackingByIdResponseSchema,
    type GetCareTrackingDto,
    type GetCareTrackingsByPatientNameResponse,
    getCareTrackingsByPatientNameResponseSchema,
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
import {useMediaApi} from "~/services/media/media.api";
import type {DocumentType} from "~/types/care-tracking";

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
                    size: requestDto.size,
                    patientId: requestDto.patientId,
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

    async function uploadMessageFiles(files: File[], careTrackingId: string): Promise<{ url: string; id: string }[]> {
        const promises = files.map(async (file) => {
            const {preUploadFile, getSignedUrl, uploadFile, getFile} = useMediaApi();
            const document = await preUploadFile({
                endPoint: `/doctors/care-tracking/${careTrackingId}/documents`,
                filename: file.name + '-' + Date.now(),
                type: "Autre",
            });
            const signedUrl = await getSignedUrl(`/doctors/care-tracking/upload-url/${document.id}`);
            await uploadFile(file, signedUrl.url);
            return getFile(`/doctors/care-tracking/${careTrackingId}/documents/${document.id}`);
        })

        const results = await Promise.allSettled(promises);
        return results
            .filter(result => result.status === 'fulfilled')
            .map(result => (result as PromiseFulfilledResult<{ url: string, id: string }>).value);
    }

    async function uploadCareTrackingFiles(files: File[], careTrackingId: string, type: DocumentType): Promise<{
        url: string;
        id: string
    }[]> {
        const promises = files.map(async (file) => {
            const {preUploadFile, getSignedUrl, uploadFile, getFile} = useMediaApi();
            const document = await preUploadFile({
                endPoint: `/doctors/care-tracking/${careTrackingId}/documents`,
                filename: file.name + '-' + Date.now(),
                type: type,
            });
            const signedUrl = await getSignedUrl(`/doctors/care-tracking/upload-url/${document.id}`);
            await uploadFile(file, signedUrl.url);
            return getFile(`/doctors/care-tracking/${careTrackingId}/documents/${document.id}`);
        })

        const results = await Promise.allSettled(promises);
        return results
            .filter(result => result.status === 'fulfilled')
            .map(result => (result as PromiseFulfilledResult<{ url: string, id: string }>).value);
    }

    async function searchCareTrackingByPatientName(name: string) {
        return new RequestBuilder(BASE_API_URL)
            .get('/doctors/search/care-tracking')
            .withQuery<GetCareTrackingsQuery>(getCareTrackingsQuerySchema)
            .withResponse<GetCareTrackingsByPatientNameResponse>(getCareTrackingsByPatientNameResponseSchema)
            .execute({
                query: {
                    name: name
                }
            });
    }

    return {
        fetchCareTracking,
        fetchCareTrackingById,
        createCareTracking,
        updateCareTracking,
        removeCareTracking,
        uploadMessageFiles,
        uploadCareTrackingFiles,
        searchCareTrackingByPatientName,
    };
};

