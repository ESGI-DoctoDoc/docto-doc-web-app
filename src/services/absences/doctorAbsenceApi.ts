import {RequestBuilder} from "~/api/request-builder";
import {
    type CreateDoctorAbsenceBody,
    createDoctorAbsenceBodySchema,
    type CreateDoctorAbsenceDto
} from "~/services/absences/dto/save-absence.dto";
import {
    type GetDoctorAbsencesResponse,
    getDoctorAbsencesResponseSchema
} from "~/services/absences/dto/get-absences.dto";


export const doctorAbsenceApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`;

    function createAbsence(requestDto: CreateDoctorAbsenceDto) {
        return new RequestBuilder(BASE_API_URL)
            .post('/doctors/absences')
            .withBody<CreateDoctorAbsenceBody>(createDoctorAbsenceBodySchema)
            .execute({
                body: {
                    date: requestDto.date,
                    startHour: requestDto.startHour,
                    endHour: requestDto.endHour,
                    start: requestDto.start,
                    end: requestDto.end,
                    description: requestDto.description?.trim() || undefined
                }
            });
    }

    function getAbsences() {
        return new RequestBuilder(BASE_API_URL)
            .get('/doctors/absences')
            .withResponse<GetDoctorAbsencesResponse>(getDoctorAbsencesResponseSchema)
            .execute();
    }

    return {
        createAbsence,
        getAbsences
    };
}