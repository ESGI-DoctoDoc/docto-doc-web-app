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
import type {DocumentType} from "~/types/care-tracking";
import {useMediaApi} from "~/services/media/media.api";

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

    async function uploadMedicalRecordFiles(files: File[], medicalRecordId: string, type: DocumentType): Promise<{
        url: string;
        id: string
    }[]> {
        const promises = files.map(async (file) => {
            const {preUploadFile, getSignedUrl, uploadFile, getFile} = useMediaApi();
            //todo abd changer l'url
            const document = await preUploadFile({
                endPoint: `/doctors/care-tracking/${medicalRecordId}/documents`,
                filename: file.name + '-' + Date.now(),
                type: type,
            });
            const signedUrl = await getSignedUrl(`/doctors/care-tracking/upload-url/${document.id}`);
            await uploadFile(file, signedUrl.url);
            return getFile(`/doctors/care-tracking/${medicalRecordId}/documents/${document.id}`);
        })

        const results = await Promise.allSettled(promises);
        return results
            .filter(result => result.status === 'fulfilled')
            .map(result => (result as PromiseFulfilledResult<{ url: string, id: string }>).value);
    }

    return {
        fetchPatients,
        fetchPatientById,
        uploadMedicalRecordFiles,
    }
}