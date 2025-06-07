import {z} from "zod";

export const getMedicalConcernsResponseSchema = z.array(z.object({
    id: z.string(),
    name: z.string(),
    duration: z.number(),
    price: z.number(),
    questions: z.array(
        z.object({
            id: z.string(),
            question: z.string(),
            type: z.enum(['text', 'list', 'yes_no']),
            options: z.array(z.object({label: z.string(), value: z.string()})).optional(),
            isMandatory: z.boolean(),
            createdAt: z.string(),
            archivedAt: z.string().optional(),
        })
    ),
    createdAt: z.string(),
    archivedAt: z.string().optional(),
}))
export type GetMedicalConcernsResponse = z.infer<typeof getMedicalConcernsResponseSchema>