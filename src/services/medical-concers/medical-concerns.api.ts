import {RequestBuilder} from "~/api/request-builder";
import {
    type GetMedicalConcernsResponse,
    getMedicalConcernsResponseSchema
} from "~/services/medical-concers/dto/get-medical-concers.dto";


export const medicalConcernsApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`

    async function fetchDoctorMedicalConcerns() {
        return new RequestBuilder(BASE_API_URL)
            .get('/medical-concerns')
            .withResponse<GetMedicalConcernsResponse>(getMedicalConcernsResponseSchema)
            .execute()
    }

    async function editDoctorMedicalConcerns() {
        throw new Error('Not implemented yet');
    }

    async function removeDoctorMedicalConcern(medicalConcernId: string) {
        return new RequestBuilder(BASE_API_URL)
            .delete(`/medical-concerns/${medicalConcernId}`)
            .execute()
    }

    return {
        fetchDoctorMedicalConcerns,
        editDoctorMedicalConcerns,
        removeDoctorMedicalConcern,
    }
}