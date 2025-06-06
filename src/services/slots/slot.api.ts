import {RequestBuilder} from "~/api/request-builder";
import {
    type CreateSlotBody,
    createSlotBodySchema,
    type CreateSlotDto,
    type CreateSlotResponse,
    createSlotResponseSchema
} from "~/services/slots/dto/save-slot.dto";

export const slotApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`


    async function getSlots() {
        return new RequestBuilder(BASE_API_URL)
            .get('doctors/slots')
            .execute()
    }

    async function createSlot(requestDto: CreateSlotDto) {
        return new RequestBuilder(BASE_API_URL)
            .post('/doctors/slots')
            .withBody<CreateSlotBody>(createSlotBodySchema)
            .withResponse<CreateSlotResponse>(createSlotResponseSchema)
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
        createSlot
    }
}