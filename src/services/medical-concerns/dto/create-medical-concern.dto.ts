import {z} from "zod";
import {MedicalConcernDuration} from "~/types/medical-concern-duration";

export interface CreateMedicalConcernDto {
    name: string;
    duration: 15 | 30 | 45 | 60 | 90 | 120;
    price: number;
}

export interface UpdateMedicalConcernDto extends CreateMedicalConcernDto {
    id: string;
}

export const createMedicalConcernBody = z.object({
    name: z.string(),
    duration: z.nativeEnum(MedicalConcernDuration),
    price: z.number().nonnegative(),
})
export type CreateMedicalConcernBody = z.infer<typeof createMedicalConcernBody>;

export const updateMedicalConcernBody = z.object({
    name: z.string(),
    durationInMinutes: z.nativeEnum(MedicalConcernDuration),
    price: z.number().nonnegative(),
})
export type UpdateMedicalConcernBody = z.infer<typeof updateMedicalConcernBody>;
