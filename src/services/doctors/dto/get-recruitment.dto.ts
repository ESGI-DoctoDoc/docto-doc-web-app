import {z} from 'zod';

export const getRecruitmentResponseSchema = z.array(z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    createdAt: z.string(),
}))
export type GetRecruitmentResponse = z.infer<typeof getRecruitmentResponseSchema>;
