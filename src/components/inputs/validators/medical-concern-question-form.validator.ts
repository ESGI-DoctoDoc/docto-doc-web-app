import {z} from "zod";

const questionTypeSchema = z.enum(['text', 'list', 'yes_no']);
const questionOptionSchema = z.object({
    label: z.string().min(1).max(128),
    value: z.string().min(1).max(128),
});
export const medicalConcernQuestionSchema = z.object({
    question: z.string().min(3).max(126),
    type: questionTypeSchema,
    options: z.array(questionOptionSchema).max(10).optional(),
    isMandatory: z.boolean(),
}).superRefine((data, ctx) => {
    if (['list', 'yes_no'].includes(data.type) && data.options?.length === 0) {
        ctx.addIssue({
            path: ['options'],
            code: z.ZodIssueCode.custom,
            message: 'Les options sont obligatoires pour les types "list" ou "yes_no".',
        });
    }
});

export const createMedicalConcernQuestionSchema = z.object({
    questions: z.array(medicalConcernQuestionSchema).min(0).max(10),
});
export type CreateMedicalConcernQuestionForm = z.infer<typeof createMedicalConcernQuestionSchema>;