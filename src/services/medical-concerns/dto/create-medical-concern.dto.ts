import {z} from "zod";
import {MedicalConcernDuration} from "~/types/medical-concern-duration";

export interface CreateMedicalConcernDto {
    name: string;
    duration: 15 | 30 | 45 | 60 | 90 | 120;
    price: number;
}

export const createMedicalConcernBody = z.object({
    name: z.string(),
    duration: z.nativeEnum(MedicalConcernDuration),
    price: z.number().nonnegative(),
})
export type CreateMedicalConcernBody = z.infer<typeof createMedicalConcernBody>;

export const createMedicalConcernResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    duration: z.number().nonnegative(),
    price: z.number(),
    questions: z.array(
        z.object({
            id: z.string(),
            question: z.string(),
            type: z.enum(['text', 'list', 'yes_no', 'date']).transform((value) => value.toUpperCase()),
            options: z.array(z.object({label: z.string(), value: z.string()})).optional(),
            isMandatory: z.boolean(),
            createdAt: z.string(),
        })
    ),
    createdAt: z.string(),
    archivedAt: z.string().optional(),
})
export type CreateMedicalConcernResponse = z.infer<typeof createMedicalConcernResponseSchema>;
