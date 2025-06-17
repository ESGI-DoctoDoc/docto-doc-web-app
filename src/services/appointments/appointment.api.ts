import {RequestBuilder} from '~/api/request-builder'
import {type GetAppointmentsResponse, getAppointmentsSchema,} from "~/services/appointments/dto/get-appointments.dto";
import type {
    CreateAppointmentDto,
    UpdateAppointmentDto
} from "~/components/inputs/validators/appointment-form.validator";

export const appointmentApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`

    function createAppointment(requestDto: CreateAppointmentDto) {
        return new RequestBuilder(BASE_API_URL)
            .post('/appointments')
            .withBody()
            .execute({
                body: {
                    patientId: requestDto.patientId,
                    medicalConcernId: requestDto.medicalConcernId,
                    start: requestDto.start,
                    startHour: requestDto.startHour,
                    careTrackingId: requestDto.careTrackingId,
                    notes: requestDto.notes
                }
            })
    }

    function updateAppointment(requestDto: UpdateAppointmentDto) {
        return new RequestBuilder(BASE_API_URL)
            .put(`/appointments/${requestDto.id}`)
            .withBody()
            .execute({
                body: {
                    patientId: requestDto.patientId,
                    medicalConcernId: requestDto.medicalConcernId,
                    start: requestDto.start,
                    startHour: requestDto.startHour,
                    careTrackingId: requestDto.careTrackingId
                }
            })
    }

    function fetchAppointments() {
        return new RequestBuilder(BASE_API_URL)
            .get('/appointments')
            .withResponse<GetAppointmentsResponse>(getAppointmentsSchema)
            .execute()
    }

    function fetchAppointmentById(id: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/appointments/${id}`)
            .execute()
    }

    return {
        fetchAppointments,
        fetchAppointmentById,
        createAppointment,
        updateAppointment,
    }
}