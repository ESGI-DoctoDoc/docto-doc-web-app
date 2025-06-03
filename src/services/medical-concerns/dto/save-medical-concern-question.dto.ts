import {z} from "zod";

export interface SaveMedicalConcernDto {
    medicalConcernId: string;
    questions: {
        question: string;
        type: "text" | "list" | "yes_no";
        options?: { label: string, value: string }[];
        isMandatory: boolean;
    }[];
}

export const saveMedicalConcernQuestionBody = z.array(z.object({
    question: z.string(),
    type: z.enum(['text', 'list', 'yes_no']),
    options: z.array(z.object({
        label: z.string(),
        value: z.string(),
    })).optional(),
    isMandatory: z.boolean(),
}));
export type SaveMedicalConcernQuestionBody = z.infer<typeof saveMedicalConcernQuestionBody>;