import {z} from 'zod';

export interface CreateDoctorAbsenceDto {
    startHour?: string;
    endHour?: string;
    date?: string;
    start?: string;
    end?: string;
    description?: string;
}

export const createDoctorAbsenceBodySchema = z.object({
    startHour: z.string().trim().optional(),
    endHour: z.string().trim().optional(),
    date: z.string().trim().optional(), // single day or range
    start: z.string().trim().optional(),
    end: z.string().trim().optional(),
    description: z.string().trim().transform((value) => value?.replaceAll('  ', ' ')).optional(),
});
export type CreateDoctorAbsenceBody = z.infer<typeof createDoctorAbsenceBodySchema>;