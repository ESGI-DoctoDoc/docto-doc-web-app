import {z} from 'zod';

export interface GetDoctorAbsenceDto {
    startDate: string;
}

export const getDoctorAbsencesQuerySchema = z.object({
    startDate: z.string(),
})
export type GetDoctorAbsencesQuery = z.infer<typeof getDoctorAbsencesQuerySchema>;

export const getDoctorAbsencesResponseSchema = z.array(z.object({
    id: z.string(),
    date: z.union([z.string(), z.null()]).optional(),
    startHour: z.union([z.string(), z.null()]).optional(),
    endHour: z.union([z.string(), z.null()]).optional(),
    start: z.union([z.string(), z.null()]).optional(),
    end: z.union([z.string(), z.null()]).optional(),
    description: z.union([z.string(), z.null()]).optional(),
    createdAt: z.string(),
}));
export type GetDoctorAbsencesResponse = z.infer<typeof getDoctorAbsencesResponseSchema>;