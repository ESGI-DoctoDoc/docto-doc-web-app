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

    return {
        fetchDoctors,
        fetchDoctorById,
        rejectDoctorVerification,
        acceptDoctorVerification,
    }
}