import {RequestBuilder} from "~/api/request-builder";
import type {AppPagination} from "~/api/app-pagination.type";
import {
    type GetDoctorByIdResponse,
    getDoctorByIdResponseSchema,
    type GetDoctorProfileResponse,
    getDoctorProfileResponseSchema,
    type GetDoctorsByNameResponse,
    getDoctorsByNameResponseSchema,
    type GetDoctorsQuery,
    getDoctorsQuerySchema,
    type GetDoctorsResponse,
    getDoctorsResponseSchema
} from "~/services/doctors/dto/get-doctors.dto";
import {useMediaApi} from "~/services/media/media.api";
import {
    type FetchNotificationsResponse,
    fetchNotificationsResponseSchema
} from "~/services/doctors/dto/get-notifications.dto";
import {
    type UpdateDoctorBody,
    updateDoctorBodySchema,
    type UpdateDoctorProfile
} from "~/services/doctors/dto/update-doctors.dto";
import {type GetReportingResponse, getReportingResponseSchema} from "~/services/doctors/dto/get-reporting.dto";
import {
    type GetMedicalConcernsResponse,
    getMedicalConcernsResponseSchema
} from "~/services/medical-concerns/dto/get-medical-concers.dto";
import {useSession} from "~/composables/auth/useSession";
import {type GetRecruitmentResponse, getRecruitmentResponseSchema} from "~/services/doctors/dto/get-recruitment.dto";

export const doctorsApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`;

    function fetchDoctorProfile() {
        return new RequestBuilder(BASE_API_URL)
            .get('/doctors/profile')
            .withResponse<GetDoctorProfileResponse>(getDoctorProfileResponseSchema)
            .execute();
    }

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
        const {preUploadFile, getSignedUrl, uploadFile, getFile} = useMediaApi();
        const document = await preUploadFile({
            endPoint: '/doctors/onboarding/documents',
            filename: 'profile-picture' + Date.now(),
            type: 'Photo de profil',
        });
        const signedUrl = await getSignedUrl(`/doctors/onboarding/documents/upload-url/${document.id}`);
        await uploadFile(file, signedUrl.url);
        return getFile(`/doctors/onboarding/documents/${document.id}`);
    }

    async function uploadDoctorDocuments(files: File[]): Promise<{ url: string, id: string }[]> {
        const promises = files.map(async (file) => {
            const {preUploadFile, getSignedUrl, uploadFile, getFile} = useMediaApi();
            const document = await preUploadFile({
                endPoint: '/doctors/onboarding/documents',
                filename: file.name + '-' + Date.now(),
                type: "Justificatif d'identité",
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

    async function fetchNotifications() {
        const {getUser} = useSession()
        if (getUser()?.user?.role === 'admin') {
            return new RequestBuilder(BASE_API_URL)
                .get('/admin/notifications')
                .withResponse<FetchNotificationsResponse>(fetchNotificationsResponseSchema)
                .execute();
        } else {
            return new RequestBuilder(BASE_API_URL)
                .get('/doctors/notifications')
                .withResponse<FetchNotificationsResponse>(fetchNotificationsResponseSchema)
                .execute();
        }
    }

    async function markAsReadNotification(notificationId: string) {
        const {getUser} = useSession()
        if (getUser()?.user?.role === 'admin') {
            return new RequestBuilder(BASE_API_URL)
                .patch(`/admin/notifications/${notificationId}/read`)
                .execute();
        } else {
            return new RequestBuilder(BASE_API_URL)
                .patch(`/doctors/notifications/${notificationId}/read`)
                .execute();
        }
    }

    async function updateDoctorProfile(requestDto: UpdateDoctorProfile) {
        return new RequestBuilder(BASE_API_URL)
            .patch('/doctors/profile')
            .withBody<UpdateDoctorBody>(updateDoctorBodySchema)
            .execute({
                body: {
                    firstname: requestDto.firstname,
                    lastname: requestDto.lastname,
                    address: requestDto.address,
                    bio: requestDto.bio,
                    profilePictureUrl: requestDto.profilePictureUrl,
                }
            });
    }

    async function fetchDoctorReporting(doctorId: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/admin/doctors/${doctorId}/reporting`)
            .withResponse<GetReportingResponse>(getReportingResponseSchema)
            .execute();
    }

    async function fetchDoctorMedicalConcerns(doctorId: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/admin/doctors/${doctorId}/medical-concerns`)
            .withResponse<GetMedicalConcernsResponse>(getMedicalConcernsResponseSchema)
            .execute();
    }

    async function searchDoctorsByName(name: string) {
        return new RequestBuilder(BASE_API_URL)
            .get('/admin/search/doctors')
            .withQuery<GetDoctorsQuery>(getDoctorsQuerySchema)
            .withResponse<GetDoctorsByNameResponse>(getDoctorsByNameResponseSchema)
            .execute({
                query: {
                    name: name,
                }
            });
    }

    async function fetchDoctorRecruitments() {
        return new RequestBuilder(BASE_API_URL)
            .get('/admin/recruitments/doctors')
            .withResponse<GetRecruitmentResponse>(getRecruitmentResponseSchema)
            .execute();
    }

    return {
        fetchDoctors,
        fetchDoctorById,
        rejectDoctorVerification,
        acceptDoctorVerification,
        uploadDoctorProfilePicture,
        uploadDoctorDocuments,
        fetchDoctorProfile,
        fetchNotifications,
        markAsReadNotification,
        updateDoctorProfile,
        fetchDoctorReporting,
        fetchDoctorMedicalConcerns,
        searchDoctorsByName,
        fetchDoctorRecruitments,
    }
}