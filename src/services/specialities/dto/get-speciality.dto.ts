import {z} from "zod";

export const getSpecialitiesQuerySchema = z.object({
    page: z.number().optional(),
    size: z.number().optional(),
    name: z.string().optional(),
})
export type GetSpecialitiesQuery = z.infer<typeof getSpecialitiesQuerySchema>;

export const getSpecialitiesResponseSchema = z.array(
    z.object({
        id: z.string(),
        name: z.string(),
        createdAt: z.string(),
    })
);
export type GetSpecialitiesResponse = z.infer<typeof getSpecialitiesResponseSchema>;