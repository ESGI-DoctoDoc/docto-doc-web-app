import {RequestBuilder} from '~/api/request-builder'
import {type GetAppointmentsResponse, getAppointmentsSchema,} from "~/services/appointments/dto/get-appointments.dto";

export const appointmentApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`

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
    }
}