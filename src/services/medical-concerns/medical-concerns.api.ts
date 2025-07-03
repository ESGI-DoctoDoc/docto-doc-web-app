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
import {
    type SaveMedicalConcernDto,
    saveMedicalConcernQuestionBody,
    type SaveMedicalConcernQuestionBody,
} from "~/services/medical-concerns/dto/save-medical-concern-question.dto";
import {
    type GetMedicalConcernsQuestionsResponse,
    getMedicalConcernsQuestionsResponseSchema
} from "~/services/medical-concerns/dto/get-medical-concern-questions.dto";


export const medicalConcernsApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`;

    async function fetchMedicalConcerns() {
        return new RequestBuilder(BASE_API_URL)
            .get('/doctors/medical-concerns')
            .withResponse<GetMedicalConcernsResponse>(getMedicalConcernsResponseSchema)
            .execute()
    }

    async function createMedicalConcern(requestDto: CreateMedicalConcernDto) {
        return new RequestBuilder(BASE_API_URL)
            .post('/doctors/medical-concerns')
            .withBody<CreateMedicalConcernBody>(createMedicalConcernBody)
            .withResponse<CreateMedicalConcernResponse>(createMedicalConcernResponseSchema)
            .execute({
                body: {
                    name: requestDto.name,
                    duration: requestDto.duration,
                    price: requestDto.price,
                }
            })
    }

    async function editDoctorMedicalConcerns() {
        throw new Error('Not implemented yet');
    }

    async function removeMedicalConcern(medicalConcernId: string) {
        return new RequestBuilder(BASE_API_URL)
            .delete(`/doctors/medical-concerns/${medicalConcernId}`)
            .execute()
    }

    /* Questions */
    async function saveMedicalConcernQuestions(requestDto: SaveMedicalConcernDto) {
        return new RequestBuilder(BASE_API_URL)
            .post(`/doctors/medical-concerns/${requestDto.medicalConcern}/questions`)
            .withBody<SaveMedicalConcernQuestionBody>(saveMedicalConcernQuestionBody)
            .execute({
                body: {
                    questions: requestDto.questions
                },
            })
    }

    function getQuestionsByMedicalConcernId(medicalConcernId: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/doctors/medical-concerns/${medicalConcernId}/questions`)
            .withResponse<GetMedicalConcernsQuestionsResponse>(getMedicalConcernsQuestionsResponseSchema)
            .execute()
    }

    return {
        fetchMedicalConcerns,
        createMedicalConcern,
        editDoctorMedicalConcerns,
        removeMedicalConcern,
        saveMedicalConcernQuestions,
        getQuestionsByMedicalConcernId
    }
}