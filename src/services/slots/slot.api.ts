import {RequestBuilder} from "~/api/request-builder";
import {
    type CreateExceptionalSlotBody,
    createExceptionalSlotBodySchema,
    type CreateSlotDto,
    type CreateSlotMonthlyBody,
    createSlotMonthlyBodySchema,
    type CreateSlotWeeklyBody,
    createSlotWeeklyBodySchema,
    type UpdateSlotBody,
    updateSlotBodySchema,
    type UpdateSlotDto,
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
            .get(`/doctors/medical-concerns/${requestDtp.medicalConcernId}/get-appointments-availability`)
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
        } else {
            return new RequestBuilder(BASE_API_URL)
                .post('/doctors/slots')
                .withBody<CreateExceptionalSlotBody>(createExceptionalSlotBodySchema)
                .execute({
                    body: {
                        startHour: requestDto.startHour,
                        endHour: requestDto.endHour,
                        start: requestDto.start,
                        medicalConcerns: requestDto.medicalConcerns
                    }
                })
        }
    }

    async function updateSlot(id: string, requestDto: UpdateSlotDto) {
        if (requestDto.allSlot) {
            return new RequestBuilder(BASE_API_URL)
                .put(`/doctors/slots/${id}/recurrence`)
                .withBody<UpdateSlotBody>(updateSlotBodySchema)
                .execute({
                    body: {
                        startHour: requestDto.startHour,
                        endHour: requestDto.endHour,
                        medicalConcerns: requestDto.medicalConcerns
                    }
                })
        } else {
            return new RequestBuilder(BASE_API_URL)
                .put(`/doctors/slots/${id}`)
                .withBody<UpdateSlotBody>(updateSlotBodySchema)
                .execute({
                    body: {
                        startHour: requestDto.startHour,
                        endHour: requestDto.endHour,
                        medicalConcerns: requestDto.medicalConcerns
                    }
                })
        }
    }

    function deleteSlot(id: string, allSlot: boolean) {
        if (allSlot) {
            return new RequestBuilder(BASE_API_URL)
                .delete(`/doctors/slots/${id}/recurrence`)
                .execute();
        } else {
            return new RequestBuilder(BASE_API_URL)
                .delete(`/doctors/slots/${id}`)
                .execute();
        }
    }


    return {
        getSlotsAvailable,
        getSlots,
        getSlotById,
        createSlot,
        updateSlot,
        deleteSlot,
    }
}