import {RequestBuilder} from "~/api/request-builder";
import {
    type CreateSpecialityBody,
    createSpecialityBodySchema,
    type CreateSpecialityDto,
    type CreateSpecialityResponse,
    createSpecialityResponseSchema
} from "~/services/specialities/dto/create-speciality.dto";
import {
    type GetSpecialitiesResponse,
    getSpecialitiesResponseSchema
} from "~/services/specialities/dto/get-speciality.dto";

export const specialityApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`

    async function getSpecialities() {
        return new RequestBuilder(BASE_API_URL)
            .get('/specialities')
            .withResponse<GetSpecialitiesResponse>(getSpecialitiesResponseSchema)
            .execute()
    }

    async function createSpeciality(request: CreateSpecialityDto) {
        return new RequestBuilder(BASE_API_URL)
            .post('/specialities')
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
        createSpeciality
    }
}