import {RequestBuilder} from '~/api/request-builder'
import {
    type GetAppointmentByIdResponse,
    getAppointmentByIdResponseSchema,
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

    function fetchAppointments() {
        return new RequestBuilder(BASE_API_URL)
            .get('/doctors/appointments')
            .withResponse<GetAppointmentsResponse>(getAppointmentsSchema)
            .execute()
    }

    function fetchAppointmentById(id: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/doctors/appointments/${id}`)
            .withResponse<GetAppointmentByIdResponse>(getAppointmentByIdResponseSchema)
            .execute()
    }

    return {
        fetchAppointments,
        fetchAppointmentById,
        createAppointment,
        updateAppointment,
    }
}