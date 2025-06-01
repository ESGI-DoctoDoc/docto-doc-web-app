import {z} from "zod";

export const getMedicalConcernsQuerySchema = z.object({})
export type GetMedicalConcernsQuery = z.infer<typeof getMedicalConcernsQuerySchema>

export const getMedicalConcernsResponseSchema = z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
}))
export type GetMedicalConcernsResponse = z.infer<typeof getMedicalConcernsResponseSchema>