import {z} from "zod";
import {
  createMedicalConcernQuestionSchema
} from "~/components/inputs/validators/medical-concern-question-form.validator";

const nameSchema = z.string().min(3).max(128);
const durationSchema = z.enum(["0h15", "0h30", "0h45", "1h00", "1h30", "2h00"]);
const priceSchema = z.number().nonnegative();
const questionsSchema = z.array(createMedicalConcernQuestionSchema).max(10);

export const createMedicalConcernSchema = z.object({
    name: nameSchema,
    duration: durationSchema,
    price: priceSchema,
    questions: questionsSchema,
});
export type CreateMedicalConcernForm = z.infer<typeof createMedicalConcernSchema>;

export const updateMedicalConcernSchema = z.object({
    name: nameSchema,
    duration: durationSchema,
    price: priceSchema,
    questions: questionsSchema,
});
export type UpdateMedicalConcernForm = z.infer<typeof updateMedicalConcernSchema>;
