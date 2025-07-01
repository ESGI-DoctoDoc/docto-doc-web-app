import {RequestBuilder} from '~/api/request-builder'
import type {Patient, PatientDetails} from '~/types/patient'
import {
    type GetPatientByIdResponse,
    getPatientByIdResponseSchema,
    getPatientsQuerySchema,
    type GetPatientsQuerySchema,
    type GetPatientsResponse,
    getPatientsResponseSchema
} from "~/services/patients/dto/get-patients.dto";
import type {AppPagination} from "~/api/app-pagination.type";

export const patientsApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`

    function fetchPatients(requestDto: AppPagination<unknown>) {
        return new RequestBuilder(BASE_API_URL)
            .get('/doctors/patients')
            .withQuery<GetPatientsQuerySchema>(getPatientsQuerySchema)
            .withResponse<GetPatientsResponse>(getPatientsResponseSchema)
            .execute({
                query: {
                    page: requestDto.page,
                    size: requestDto.size
                }
            }) as Promise<Patient[]>
    }

    function fetchPatientById(id: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/patients/${id}`)
            .withResponse<GetPatientByIdResponse>(getPatientByIdResponseSchema)
            .execute() as Promise<PatientDetails>
    }

    return {
        fetchPatients,
        fetchPatientById
    }
}