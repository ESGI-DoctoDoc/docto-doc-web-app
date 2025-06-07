import {z} from "zod";

export const getSlotsResponseSchema = z.array(
    z.object({
        id: z.string(),
        startHour: z.string(),
        endHour: z.string(),
        day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
        recurrence: z.enum(['none', 'weekly', 'monthly']),
    })
)
export type GetSlotsResponse = z.infer<typeof getSlotsResponseSchema>;

export const getSlotByIdResponseSchema = z.object({
    id: z.string(),
    startHour: z.string(),
    endHour: z.string(),
    day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    recurrence: z.enum(['none', 'weekly', 'monthly']),
    start: z.string().optional(),
    end: z.string().optional(),
    dayNumber: z.number().min(0).max(28).optional(),
    medicalConcerns: z.array(z.object({
        id: z.string(),
        name: z.string(),
        duration: z.number(),
    })),
})
export type GetSlotByIdResponse = z.infer<typeof getSlotByIdResponseSchema>;