import {z} from "zod";

const questionTypeSchema = z.enum(['text', 'list', 'yes_no']);

const questionOptionSchema = z.object({
    label: z.string()
        .min(1, "form.medicalConcernQuestion.option.label.min")
        .max(128, "form.medicalConcernQuestion.option.label.max"),
    value: z.string()
        .min(1, "form.medicalConcernQuestion.option.value.min")
        .max(128, "form.medicalConcernQuestion.option.value.max"),
});

export const medicalConcernQuestionSchema = z.object({
    question: z.string()
        .min(3, "form.medicalConcernQuestion.question.min")
        .max(126, "form.medicalConcernQuestion.question.max"),
    type: questionTypeSchema,
    options: z.array(questionOptionSchema)
        .max(10, "form.medicalConcernQuestion.options.max")
        .optional(),
    isMandatory: z.boolean(),
}).superRefine((data, ctx) => {
    if (['list', 'yes_no'].includes(data.type) && (data.options?.length === 0)) {
        ctx.addIssue({
            path: ['options'],
            code: z.ZodIssueCode.custom,
            message: 'Les options sont obligatoires pour les types "list" ou "yes_no".',
        });
    }
});

export const createMedicalConcernQuestionSchema = z.object({
    questions: z.array(medicalConcernQuestionSchema)
        .min(0, "form.medicalConcernQuestion.questions.min")
        .max(10, "form.medicalConcernQuestion.questions.max"),
});
export type CreateMedicalConcernQuestionForm = z.infer<typeof createMedicalConcernQuestionSchema>;