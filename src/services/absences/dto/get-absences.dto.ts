import {z} from 'zod';

export const getDoctorAbsencesResponseSchema = z.array(z.object({
    id: z.string(),
    date: z.string().optional(),
    startHour: z.string().optional(),
    endHour: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
    description: z.string().optional(),
    createdAt: z.string(),
}))
export type GetDoctorAbsencesResponse = z.infer<typeof getDoctorAbsencesResponseSchema>;