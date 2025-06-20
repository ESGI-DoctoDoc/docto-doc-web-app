import {RequestBuilder} from '~/api/request-builder'
import {
    type GetAppointmentByIdResponse,
    getAppointmentByIdResponseSchema,
    type GetAppointmentsDto,
    type GetAppointmentsQuery,
    getAppointmentsQuerySchema,
    type GetAppointmentsResponse,
    getAppointmentsSchema,
} from "~/services/appointments/dto/get-appointments.dto";
import type {
    CreateAppointmentDto,
    UpdateAppointmentDto
} from "~/components/inputs/validators/appointment-form.validator";
import {
    type CreateAppointmentBody,
    saveAppointmentBodySchema,
    type UpdateAppointmentBody,
} from "~/services/appointments/dto/save-appointment";
import {
    type CancelAppointmentBody,
    cancelAppointmentBodySchema
} from "~/services/appointments/dto/update-appontment.dto";
import type {AppPagination} from "~/api/app-pagination.type";

export const appointmentApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`

    function createAppointment(requestDto: CreateAppointmentDto) {
        return new RequestBuilder(BASE_API_URL)
            .post('/doctors/appointments')
            .withBody<CreateAppointmentBody>(saveAppointmentBodySchema)
            .execute({
                body: {
                    patientId: requestDto.patientId,
                    medicalConcernId: requestDto.medicalConcernId,
                    start: requestDto.start,
                    startHour: requestDto.startHour,
                    careTrackingId: requestDto.careTrackingId,
                    notes: requestDto.notes,
                    answers: requestDto.answers?.map(answer => ({
                        questionId: answer.questionId,
                        answer: answer.answer
                    }))
                }
            })
    }

    function updateAppointment(requestDto: UpdateAppointmentDto) {
        return new RequestBuilder(BASE_API_URL)
            .put(`/doctors/appointments/${requestDto.id}`)
            .withBody<UpdateAppointmentBody>(saveAppointmentBodySchema)
            .execute({
                body: {
                    patientId: requestDto.patientId,
                    medicalConcernId: requestDto.medicalConcernId,
                    start: requestDto.start,
                    startHour: requestDto.startHour,
                    careTrackingId: requestDto.careTrackingId,
                    notes: requestDto.notes,
                    answers: requestDto.answers?.map(answer => ({
                        questionId: answer.questionId,
                        answer: answer.answer
                    }))
                }
            })
    }

    function fetchAppointments(requestDto: AppPagination<GetAppointmentsDto>) {
        return new RequestBuilder(BASE_API_URL)
            .get('/doctors/appointments')
            .withQuery<GetAppointmentsQuery>(getAppointmentsQuerySchema)
            .withResponse<GetAppointmentsResponse>(getAppointmentsSchema)
            .execute({
                query: {
                    startDate: requestDto.startDate,
                    page: requestDto.page,
                    size: requestDto.size,
                }
            })
    }

    function fetchAppointmentById(id: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/doctors/appointments/${id}`)
            .withResponse<GetAppointmentByIdResponse>(getAppointmentByIdResponseSchema)
            .execute()
    }

    function cancelAppointment(id: string, reason: string) {
        return new RequestBuilder(BASE_API_URL)
            .patch(`/doctors/appointments/${id}`)
            .withBody<CancelAppointmentBody>(cancelAppointmentBodySchema)
            .execute({
                body: {reason}
            })
    }

    return {
        fetchAppointments,
        fetchAppointmentById,
        createAppointment,
        updateAppointment,
        cancelAppointment,
    }
}
