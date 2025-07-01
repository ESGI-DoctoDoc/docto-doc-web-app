import {RequestBuilder} from "~/api/request-builder";
import {
    type CreateSpecialityBody,
    createSpecialityBodySchema,
    type CreateSpecialityDto,
    type CreateSpecialityResponse,
    createSpecialityResponseSchema,
    type UpdateSpecialityDto
} from "~/services/specialities/dto/create-speciality.dto";
import {
    type GetSpecialitiesQuery,
    getSpecialitiesQuerySchema,
    type GetSpecialitiesResponse,
    getSpecialitiesResponseSchema
} from "~/services/specialities/dto/get-speciality.dto";
import type {AppPagination} from "~/api/app-pagination.type";

export const specialityApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`

    async function getSpecialities(requestDto: AppPagination<unknown>) {
        return new RequestBuilder(BASE_API_URL)
            .get('/doctors/specialities')
            .withQuery<GetSpecialitiesQuery>(getSpecialitiesQuerySchema)
            .withResponse<GetSpecialitiesResponse>(getSpecialitiesResponseSchema)
            .execute({
                query: {
                    page: requestDto.page,
                    size: requestDto.size
                }
            })
    }

    async function createSpeciality(request: CreateSpecialityDto) {
        return new RequestBuilder(BASE_API_URL)
            .post('/doctors/specialities')
            .withBody<CreateSpecialityBody>(createSpecialityBodySchema)
            .withResponse<CreateSpecialityResponse>(createSpecialityResponseSchema)
            .execute({
                body: {
                    name: request.name
                }
            })
    }

    async function updateSpeciality(request: UpdateSpecialityDto) {
        return new RequestBuilder(BASE_API_URL)
            .put(`/doctors/specialities/${request.specialityId}`)
            .withBody<CreateSpecialityBody>(createSpecialityBodySchema)
            .withResponse<CreateSpecialityResponse>(createSpecialityResponseSchema)
            .execute({
                body: {
                    name: request.name
                }
            })
    }

    return {
        getSpecialities,
        createSpeciality,
        updateSpeciality,
    }
}