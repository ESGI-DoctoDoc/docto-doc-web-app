import {RequestBuilder} from "~/api/request-builder";
import {
    type CreateDoctorAbsenceDateBody,
    createDoctorAbsenceDateBodySchema,
    type CreateDoctorAbsenceDto,
    type CreateDoctorAbsenceRangeBody,
    createDoctorAbsenceRangeBodySchema,
} from "~/services/absences/dto/save-absence.dto";
import {
    type GetDoctorAbsenceDto,
    type GetDoctorAbsencesQuery,
    getDoctorAbsencesQuerySchema,
    type GetDoctorAbsencesResponse,
    getDoctorAbsencesResponseSchema
} from "~/services/absences/dto/get-absences.dto";


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
                        description: requestDto.description?.trim() || undefined
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

    return {
        createAbsence,
        getAbsences
    };
}