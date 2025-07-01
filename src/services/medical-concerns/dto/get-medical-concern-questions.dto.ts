import {z} from 'zod';

export const getMedicalConcernsQuestionsResponseSchema = z.array(z.object({
    id: z.string(),
    question: z.string(),
    type: z.enum(['text', 'list', 'yes_no']),
    options: z.array(z.object({label: z.string(), value: z.string()})).optional(),
    isMandatory: z.boolean(),
    createdAt: z.string(),
    archivedAt: z.string().optional(),
}))
export type GetMedicalConcernsQuestionsResponse = z.infer<typeof getMedicalConcernsQuestionsResponseSchema>;
