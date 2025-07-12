import {z} from "zod";
import {medicalConcernQuestionSchema} from "~/components/inputs/validators/medical-concern-question-form.validator";
import {MedicalConcernDuration} from "~/types/medical-concern-duration";

const nameSchema = z
    .string()
    .min(3, "form.medicalConcern.name.min")
    .max(128, "form.medicalConcern.name.max");

const durationSchema = z.nativeEnum(MedicalConcernDuration, {
    errorMap: () => ({message: "form.medicalConcern.duration"}),
});

const priceSchema = z.number().nonnegative("form.medicalConcern.price.nonNegative");

const questionsSchema = z
    .array(medicalConcernQuestionSchema)
    .max(10, "form.medicalConcern.questions.max");

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