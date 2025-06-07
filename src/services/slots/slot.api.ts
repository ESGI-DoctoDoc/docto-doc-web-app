import {RequestBuilder} from "~/api/request-builder";
import {type CreateSlotBody, createSlotBodySchema, type CreateSlotDto,} from "~/services/slots/dto/save-slot.dto";
import {
    type GetSlotByIdResponse,
    getSlotByIdResponseSchema,
    type GetSlotsResponse,
    getSlotsResponseSchema
} from "~/services/slots/dto/get-slots.dto";

export const slotApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`


    async function getSlots() {
        return new RequestBuilder(BASE_API_URL)
            .get('/doctors/slots')
            .withResponse<GetSlotsResponse>(getSlotsResponseSchema)
            .execute()
    }

    async function getSlotById(id: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/doctors/slots/${id}`)
            .withResponse<GetSlotByIdResponse>(getSlotByIdResponseSchema)
            .execute()
    }

    async function createSlot(requestDto: CreateSlotDto) {
        return new RequestBuilder(BASE_API_URL)
            .post('/doctors/slots')
            .withBody<CreateSlotBody>(createSlotBodySchema)
            // .withResponse<CreateSlotResponse>(createSlotResponseSchema)
            .execute({
                body: {
                    day: requestDto.day,
                    startHour: requestDto.startHour,
                    endHour: requestDto.endHour,
                    recurrence: requestDto.recurrence,
                    start: requestDto.start,
                    end: requestDto.end,
                    medicalConcerns: requestDto.medicalConcerns
                }
            })
    }


    return {
        getSlots,
        getSlotById,
        createSlot
    }
}