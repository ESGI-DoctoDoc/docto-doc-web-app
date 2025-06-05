import {z} from "zod";
import {medicalConcernQuestionSchema} from "~/components/inputs/validators/medical-concern-question-form.validator";
import {MedicalConcernDuration} from "~/types/medical-concern-duration";

const nameSchema = z.string().min(3).max(128);
const durationSchema = z.nativeEnum(MedicalConcernDuration);
const priceSchema = z.number().nonnegative();
const questionsSchema = z.array(medicalConcernQuestionSchema).max(10);

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
