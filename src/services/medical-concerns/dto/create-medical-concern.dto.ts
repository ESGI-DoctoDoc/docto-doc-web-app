import {z} from "zod";

export interface CreateMedicalConcernQuestionDto {
    question: string;
    type: "text" | "list" | "yes_no";
    options?: { label: string, value: string }[];
}

export interface CreateMedicalConcernDto {
    name: string;
    duration: "0h15" | "0h30" | "0h45" | "1h00" | "1h30" | "2h00";
    price: number;
    questions: CreateMedicalConcernQuestionDto[];
}

export const createMedicalConcernBody = z.object({
    name: z.string(),
    duration: z.enum(["0h15", "0h30", "0h45", "1h00", "1h30", "2h00"]),
    price: z.number().nonnegative(),
    questions: z.array(z.object({
        question: z.string(),
        type: z.enum(["text", "list", "yes_no"]),
        options: z.array(z.object({
            label: z.string(),
            value: z.string(),
        })).optional()
    }))
})
export type CreateMedicalConcernBody = z.infer<typeof createMedicalConcernBody>;

export const createMedicalConcernResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    duration: z.string(),
    price: z.number(),
    questions: z.array(
        z.object({
            id: z.string(),
            question: z.string(),
            type: z.enum(['text', 'list', 'yes_no']),
            options: z.array(z.object({label: z.string(), value: z.string()})).optional(),
            isMandatory: z.boolean(),
            createdAt: z.string(),
        })
    ),
    createdAt: z.string(),
    archivedAt: z.string().optional(),
})
export type CreateMedicalConcernResponse = z.infer<typeof createMedicalConcernResponseSchema>;
