import {z} from "zod";

export interface CreateSlotDto {
    day?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    startHour: string;
    endHour: string;
    recurrence: 'none' | 'weekly' | 'monthly';
    start?: string;
    end?: string;
    dayNumber?: number;
    medicalConcerns: string[];
}

export const createSlotBodySchema = z.object({
    day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
        .transform((val) => val?.toUpperCase())
        .optional(),
    startHour: z.string(),
    endHour: z.string(),
    recurrence: z.enum(['none', 'weekly', 'monthly']),
    start: z.string().optional(),
    end: z.string().optional(),
    dayNumber: z.number().optional(),
    medicalConcerns: z.array(z.string().uuid()),
});
export type CreateSlotBody = z.infer<typeof createSlotBodySchema>;

// export const createSlotResponseSchema = z.object({
//     id: z.string(),
// });
// export type CreateSlotResponse = z.infer<typeof createSlotResponseSchema>;