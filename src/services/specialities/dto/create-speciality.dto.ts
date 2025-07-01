import {z} from "zod";

export interface CreateSpecialityDto {
    name: string;
}

export const createSpecialityBodySchema = z.object({
    name: z.string(),
});
export type CreateSpecialityBody = z.infer<typeof createSpecialityBodySchema>;

export const createSpecialityResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.string(),
});
export type CreateSpecialityResponse = z.infer<typeof createSpecialityResponseSchema>;

