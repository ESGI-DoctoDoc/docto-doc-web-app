import {z} from 'zod';

export const getReportingResponseSchema = z.array(z.object({
    id: z.string(),
    reporter: z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
    }),
    explanation: z.string(),
    status: z.enum(['pending', 'resolved', 'rejected']),
    createdAt: z.string(),
}));

export type GetReportingResponse = z.infer<typeof getReportingResponseSchema>;