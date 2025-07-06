import {z} from 'zod';

export interface CreateDoctorAbsenceDto {
    startHour?: string;
    endHour?: string;
    date?: string;
    start?: string;
    end?: string;
    description?: string;
    notifyPatients?: boolean;
}

export interface UpdateDoctorAbsenceDto extends CreateDoctorAbsenceDto {
    id: string;
}

export const createDoctorAbsenceDateBodySchema = z.object({
    date: z.string().trim(),
    description: z.string().trim().transform((value) => value?.replaceAll('  ', ' ')).optional(),
    notifyPatients: z.boolean().optional(),
});
export type CreateDoctorAbsenceDateBody = z.infer<typeof createDoctorAbsenceDateBodySchema>;

export const createDoctorAbsenceRangeBodySchema = z.object({
    startHour: z.string().trim(),
    endHour: z.string().trim(),
    start: z.string().trim(),
    end: z.string().trim(),
    description: z.string().trim().transform((value) => value?.replaceAll('  ', ' ')).optional(),
    notifyPatients: z.boolean().optional(),
});
export type CreateDoctorAbsenceRangeBody = z.infer<typeof createDoctorAbsenceRangeBodySchema>;