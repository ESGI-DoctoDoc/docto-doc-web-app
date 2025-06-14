import {RequestBuilder} from '~/api/request-builder'
import type {Patient} from '~/types/patient'
import {
    type GetPatientByIdResponse,
    getPatientByIdResponseSchema,
    type GetPatientsResponse,
    getPatientsResponseSchema
} from "~/services/patients/dto/get-patients.dto";

export const patientsApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`

    function fetchPatients() {
        return new RequestBuilder(BASE_API_URL)
            .get('/patients')
            .withResponse<GetPatientsResponse>(getPatientsResponseSchema)
            .execute() as Promise<Patient[]>
    }

    function fetchPatientById(id: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/patients/${id}`)
            .withResponse<GetPatientByIdResponse>(getPatientByIdResponseSchema)
            .execute() as Promise<Patient>
    }

    return {
        fetchPatients,
        fetchPatientById
    }
}