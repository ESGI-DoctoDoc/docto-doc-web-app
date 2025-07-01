import {z} from "zod";

export const nameSchema = z.string()
    .min(3, "form.name.min")
    .max(50, "form.name.length")
    .regex(/^[a-zA-ZÀ-ÿ '-]+$/, "form.name.invalid");

export const createSpecialitySchema = z.object({
    name: nameSchema,
});
export type CreateSpecialityForm = z.infer<typeof createSpecialitySchema>;

export const updateSpecialitySchema = z.object({
    id: z.string(),
    name: nameSchema,
});
export type UpdateSpecialityForm = z.infer<typeof updateSpecialitySchema>;