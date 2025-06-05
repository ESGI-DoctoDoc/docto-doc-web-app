import {z} from "zod";

export interface SaveMedicalConcernDto {
    medicalConcernId: string;
    questions: {
        question: string;
        type: "text" | "list" | "yes_no" | "date";
        options?: { label: string, value: string }[];
        isMandatory: boolean;
    }[];
}

export const saveMedicalConcernQuestionBody = z.object({
    questions: z.array(z.object({
        question: z.string(),
        type: z.enum(['list', 'yes_no', 'text', 'date']),
        options: z.array(z.object({
            label: z.string(),
            value: z.string(),
        })).nullable().optional(),
        isMandatory: z.boolean(),
    }))
});
export type SaveMedicalConcernQuestionBody = z.infer<typeof saveMedicalConcernQuestionBody>;