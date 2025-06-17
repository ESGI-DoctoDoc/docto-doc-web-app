import {RequestBuilder} from "~/api/request-builder";
import {
    type CreateSlotDto,
    type CreateSlotMonthlyBody,
    createSlotMonthlyBodySchema,
    type CreateSlotWeeklyBody,
    createSlotWeeklyBodySchema,
} from "~/services/slots/dto/save-slot.dto";
import {
    type GetSlotAvailableDto,
    getSlotAvailableQuerySchema,
    type GetSlotByIdResponse,
    getSlotByIdResponseSchema,
    type GetSlotDto,
    getSlotQuerySchema,
    type GetSlotsAvailableQuery,
    type GetSlotsAvailableResponse,
    getSlotsAvailableResponseSchema,
    type GetSlotsQuery,
    type GetSlotsResponse,
    getSlotsResponseSchema
} from "~/services/slots/dto/get-slots.dto";

export const slotApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`

    async function getSlotsAvailable(requestDtp: GetSlotAvailableDto) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/patients/doctors/medical-concerns/${requestDtp.medicalConcernId}/get-appointments-availability`)
            .withQuery<GetSlotsAvailableQuery>(getSlotAvailableQuerySchema)
            .withResponse<GetSlotsAvailableResponse>(getSlotsAvailableResponseSchema)
            .execute({
                query: {
                    date: requestDtp.startDate,
                }
            })
    }

    async function getSlots(getSlotDto: GetSlotDto) {
        return new RequestBuilder(BASE_API_URL)
            .get('/doctors/slots')
            .withQuery<GetSlotsQuery>(getSlotQuerySchema)
            .withResponse<GetSlotsResponse>(getSlotsResponseSchema)
            .execute({
                query: {
                    startDate: getSlotDto.startDate
                }
            })
    }

    async function getSlotById(id: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/doctors/slots/${id}`)
            .withResponse<GetSlotByIdResponse>(getSlotByIdResponseSchema)
            .execute()
    }

    async function createSlot(requestDto: CreateSlotDto) {
        if (requestDto.recurrence === 'monthly') {
            return new RequestBuilder(BASE_API_URL)
                .post('/doctors/slots/monthly')
                .withBody<CreateSlotMonthlyBody>(createSlotMonthlyBodySchema)
                .execute({
                    body: {
                        startHour: requestDto.startHour,
                        endHour: requestDto.endHour,
                        start: requestDto.start,
                        end: requestDto.end,
                        dayNumber: requestDto.dayNumber,
                        medicalConcerns: requestDto.medicalConcerns
                    }
                })
        } else if (requestDto.recurrence === 'weekly') {
            return new RequestBuilder(BASE_API_URL)
                .post('/doctors/slots/weekly')
                .withBody<CreateSlotWeeklyBody>(createSlotWeeklyBodySchema)
                .execute({
                    body: {
                        day: requestDto.day,
                        startHour: requestDto.startHour,
                        endHour: requestDto.endHour,
                        start: requestDto.start,
                        end: requestDto.end,
                        medicalConcerns: requestDto.medicalConcerns
                    }
                })
        }
    }


    return {
        getSlotsAvailable,
        getSlots,
        getSlotById,
        createSlot
    }
}