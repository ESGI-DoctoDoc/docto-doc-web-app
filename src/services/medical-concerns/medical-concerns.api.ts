import {RequestBuilder} from "~/api/request-builder";
import {
    type GetMedicalConcernsResponse,
    getMedicalConcernsResponseSchema
} from "~/services/medical-concerns/dto/get-medical-concers.dto";
import {
    createMedicalConcernBody,
    type CreateMedicalConcernBody,
    type CreateMedicalConcernDto,
    type CreateMedicalConcernResponse,
    createMedicalConcernResponseSchema
} from "~/services/medical-concerns/dto/create-medical-concern.dto";


export const medicalConcernsApi = () => {
    const config = useRuntimeConfig()
    const BASE_API_URL = `${config.public.apiBase}/v1`

    async function fetchMedicalConcerns() {
        return new RequestBuilder(BASE_API_URL)
            .get('/medical-concerns')
            .withResponse<GetMedicalConcernsResponse>(getMedicalConcernsResponseSchema)
            .execute()
    }

    async function createMedicalConcern(requestDto: CreateMedicalConcernDto) {
        return new RequestBuilder(BASE_API_URL)
            .post('/medical-concerns')
            .withBody<CreateMedicalConcernBody>(createMedicalConcernBody)
            .withResponse<CreateMedicalConcernResponse>(createMedicalConcernResponseSchema)
            .execute({
                body: {
                    name: requestDto.name,
                    duration: requestDto.duration,
                    price: requestDto.price,
                    questions: requestDto.questions,
                }
            })
    }

    async function editDoctorMedicalConcerns() {
        throw new Error('Not implemented yet');
    }

    async function removeMedicalConcern(medicalConcernId: string) {
        return new RequestBuilder(BASE_API_URL)
            .delete(`/medical-concerns/${medicalConcernId}`)
            .execute()
    }

    return {
        fetchMedicalConcerns,
        createMedicalConcern,
        editDoctorMedicalConcerns,
        removeMedicalConcern,
    }
}