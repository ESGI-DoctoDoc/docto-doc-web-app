import {RequestBuilder} from "~/api/request-builder";
import type {AppPagination} from "~/api/app-pagination.type";
import {
    type GetDoctorByIdResponse,
    getDoctorByIdResponseSchema,
    type GetDoctorsQuery,
    getDoctorsQuerySchema,
    type GetDoctorsResponse,
    getDoctorsResponseSchema
} from "~/services/doctors/dto/get-doctors.dto";
import {useMediaApi} from "~/services/media/media.api";

export const doctorsApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`;

    function fetchDoctors(requestDto: AppPagination<unknown>) {
        return new RequestBuilder(BASE_API_URL)
            .get('/admin/doctors')
            .withQuery<GetDoctorsQuery>(getDoctorsQuerySchema)
            .withResponse<GetDoctorsResponse>(getDoctorsResponseSchema)
            .execute({
                query: {
                    page: requestDto.page,
                    size: requestDto.size
                }
            });
    }

    function fetchDoctorById(id: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/admin/doctors/${id}`)
            .withResponse<GetDoctorByIdResponse>(getDoctorByIdResponseSchema)
            .execute()
    }

    function rejectDoctorVerification(id: string) {
        return new RequestBuilder(BASE_API_URL)
            .patch(`/admin/doctors/${id}/refuse`)
            .execute();
    }

    function acceptDoctorVerification(id: string) {
        return new RequestBuilder(BASE_API_URL)
            .patch(`/admin/doctors/${id}/validate`)
            .execute();
    }

    async function uploadDoctorProfilePicture(file: File): Promise<{ url: string, id: string }> {
        const {preUploadFile, getSignedUrl, uploadFile, getFile} = useMediaApi()
        const document = await preUploadFile({
            endPoint: '/doctors/care-tracking/7dcec6ea-08a9-42a0-b0d6-0d7361dfd1f0/documents',
            filename: 'profile-picture-' + Date.now(),
            type: 'Certificat médical', //todo to remove
        })
        const signedUrl = await getSignedUrl(`/doctors/care-tracking/upload-url/${document.id}`);
        await uploadFile(file, signedUrl.url);
        return getFile(`/doctors/care-tracking/7dcec6ea-08a9-42a0-b0d6-0d7361dfd1f0/documents/${document.id}`);
    }

    async function uploadDoctorDocuments(files: File[]): Promise<{ url: string, id: string }[]> {
        const promises = files.map(async (file) => {
            const {preUploadFile, getSignedUrl, uploadFile, getFile} = useMediaApi();
            const document = await preUploadFile({
                endPoint: '/doctors/onboarding/documents',
                filename: file.name + '-' + Date.now(),
                type: 'Certificat médical', //todo to remove
            });
            const signedUrl = await getSignedUrl(`/doctors/onboarding/documents/upload-url/${document.id}`);
            await uploadFile(file, signedUrl.url);
            return getFile(`/doctors/onboarding/documents/${document.id}`);
        })

        const results = await Promise.allSettled(promises);
        return results
            .filter(result => result.status === 'fulfilled')
            .map(result => (result as PromiseFulfilledResult<{ url: string, id: string }>).value);
    }
    return {
        fetchDoctors,
        fetchDoctorById,
        rejectDoctorVerification,
        acceptDoctorVerification,
        uploadDoctorProfilePicture,
        uploadDoctorDocuments,
    }
}