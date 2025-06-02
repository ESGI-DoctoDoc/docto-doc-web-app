import {z} from "zod";

const questionTypeSchema = z.enum(['text', 'list', 'yes_no']);
const questionOptionSchema = z.object({
    label: z.string().min(1).max(128),
    value: z.string().min(1).max(128),
});
export const createMedicalConcernQuestionSchema = z.object({
    question: z.string().min(3).max(126),
    type: questionTypeSchema,
    options: z.array(questionOptionSchema).min(1).max(10).optional(),
    isMandatory: z.boolean(),
});
export type CreateMedicalConcernQuestionForm = z.infer<typeof createMedicalConcernQuestionSchema>;