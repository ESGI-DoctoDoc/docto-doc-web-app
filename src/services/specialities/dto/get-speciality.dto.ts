import {z} from "zod";

export const getSpecialitiesResponseSchema = z.array(
    z.object({
        id: z.string(),
        name: z.string(),
        createdAt: z.string(),
    })
);
export type GetSpecialitiesResponse = z.infer<typeof getSpecialitiesResponseSchema>;