import {RequestBuilder} from "~/api/request-builder";
import {
    type CreateDoctorAbsenceDateBody,
    createDoctorAbsenceDateBodySchema,
    type CreateDoctorAbsenceDto,
    type CreateDoctorAbsenceRangeBody,
    createDoctorAbsenceRangeBodySchema,
    type UpdateDoctorAbsenceDto,
} from "~/services/absences/dto/save-absence.dto";
import {
    type GetDoctorAbsenceDto,
    type GetDoctorAbsencesQuery,
    getDoctorAbsencesQuerySchema,
    type GetDoctorAbsencesResponse,
    getDoctorAbsencesResponseSchema
} from "~/services/absences/dto/get-absences.dto";
import {
    type GetAppointmentsOnAbsenceBody,
    getAppointmentsOnAbsenceBodySchema,
    type GetAppointmentsOnAbsenceDto,
    type GetAppointmentsOnAbsenceResponse,
    getAppointmentsOnAbsenceResponseSchema,
    type GetAppointmentsOnDateAbsenceBody,
    getAppointmentsOnDateAbsenceBodySchema
} from "~/services/absences/dto/get-appointments.dto";


export const doctorAbsenceApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`;

    function createAbsence(requestDto: CreateDoctorAbsenceDto) {
        if (requestDto.date) {
            return new RequestBuilder(BASE_API_URL)
                .post('/doctors/absences/single-day')
                .withBody<CreateDoctorAbsenceDateBody>(createDoctorAbsenceDateBodySchema)
                .execute({
                    body: {
                        date: requestDto.date,
                        description: requestDto.description?.trim() || undefined,
                        notifyPatients: requestDto.notifyPatients ?? false
                    }
                });
        }

        return new RequestBuilder(BASE_API_URL)
            .post('/doctors/absences/range')
            .withBody<CreateDoctorAbsenceRangeBody>(createDoctorAbsenceRangeBodySchema)
            .execute({
                body: {
                    startHour: requestDto.startHour ?? '',
                    endHour: requestDto.endHour ?? '',
                    start: requestDto.start ?? '',
                    end: requestDto.end ?? '',
                    description: requestDto.description?.trim() || undefined,
                    notifyPatients: requestDto.notifyPatients ?? false
                }
            });
    }

    function updateAbsence(requestDto: UpdateDoctorAbsenceDto) {
        if (requestDto.date) {
            return new RequestBuilder(BASE_API_URL)
                .put(`/doctors/absences/${requestDto.id}/single-day`)
                .withBody<CreateDoctorAbsenceDateBody>(createDoctorAbsenceDateBodySchema)
                .execute({
                    body: {
                        date: requestDto.date,
                        description: requestDto.description?.trim() || undefined
                    }
                });
        }

        return new RequestBuilder(BASE_API_URL)
            .put(`/doctors/absences/${requestDto.id}/range`)
            .withBody<CreateDoctorAbsenceRangeBody>(createDoctorAbsenceRangeBodySchema)
            .execute({
                body: {
                    startHour: requestDto.startHour ?? '',
                    endHour: requestDto.endHour ?? '',
                    start: requestDto.start ?? '',
                    end: requestDto.end ?? '',
                    description: requestDto.description?.trim() || undefined
                }
            });
    }

    function getAbsences(requestDto: GetDoctorAbsenceDto) {
        return new RequestBuilder(BASE_API_URL)
            .get('/doctors/absences')
            .withQuery<GetDoctorAbsencesQuery>(getDoctorAbsencesQuerySchema)
            .withResponse<GetDoctorAbsencesResponse>(getDoctorAbsencesResponseSchema)
            .execute({
                query: {
                    startDate: requestDto.startDate,
                }
            });
    }

    async function fetchAppointmentsOnDateAbsence(date: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/doctors/absences/appointments`)
            .withBody<GetAppointmentsOnDateAbsenceBody>(getAppointmentsOnDateAbsenceBodySchema)
            .withResponse<GetAppointmentsOnAbsenceResponse>(getAppointmentsOnAbsenceResponseSchema)
            .execute({
                body: {
                    date: date
                }
            });
    }

    async function fetchAppointmentsOnAbsence(requestDto: GetAppointmentsOnAbsenceDto) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/doctors/absences/appointments`)
            .withBody<GetAppointmentsOnAbsenceBody>(getAppointmentsOnAbsenceBodySchema)
            .withResponse<GetAppointmentsOnAbsenceResponse>(getAppointmentsOnAbsenceResponseSchema)
            .execute({
                body: {
                    start: requestDto.start,
                    startHour: requestDto.startHour,
                    end: requestDto.end,
                    endHour: requestDto.endHour
                }
            });
    }

    return {
        createAbsence,
        updateAbsence,
        getAbsences,
        fetchAppointmentsOnDateAbsence,
        fetchAppointmentsOnAbsence,
    };
}