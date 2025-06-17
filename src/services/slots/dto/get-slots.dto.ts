import {z} from "zod";

export interface GetSlotAvailableDto {
    startDate: string
    medicalConcernId: string
}

export interface GetSlotDto {
    startDate: string
}

export const getSlotAvailableQuerySchema = z.object({
    date: z.string(),
})
export type GetSlotsAvailableQuery = z.infer<typeof getSlotAvailableQuerySchema>;

export const getSlotQuerySchema = z.object({
    startDate: z.string()
})
export type GetSlotsQuery = z.infer<typeof getSlotQuerySchema>;

export const getSlotsAvailableResponseSchema = z.array(z.object({
    id: z.string(),
    date: z.string(),
    start: z.string(),
    end: z.string(),
    isBooked: z.boolean(),
}));
export type GetSlotsAvailableResponse = z.infer<typeof getSlotsAvailableResponseSchema>;

export const getSlotsResponseSchema = z.array(
    z.object({
        id: z.string(),
        date: z.string(),
        startHour: z.string(),
        endHour: z.string(),
        day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
        dayNumber: z.union([z.number(), z.null()]).optional(),
        recurrence: z.enum(['none', 'weekly', 'monthly']),
    })
)
export type GetSlotsResponse = z.infer<typeof getSlotsResponseSchema>;

export const getSlotByIdResponseSchema = z.object({
    id: z.string(),
    startHour: z.string(),
    endHour: z.string(),
    day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).optional(),
    recurrence: z.enum(['none', 'weekly', 'monthly']),
    start: z.string().optional(),
    end: z.string().optional(),
    dayNumber: z.union([z.number(), z.null()]).optional(),
    medicalConcerns: z.array(z.object({
        id: z.string(),
        name: z.string(),
        duration: z.number(),
    })),
})
export type GetSlotByIdResponse = z.infer<typeof getSlotByIdResponseSchema>;