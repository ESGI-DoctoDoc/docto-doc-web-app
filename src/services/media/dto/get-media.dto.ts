import {z} from 'zod';

export const getFileUrlResponseSchema = z.object({
    fileUrl: z.string(),
})
export type GetFileUrlResponse = z.infer<typeof getFileUrlResponseSchema>;