import {z} from 'zod';

export const uploadFileBodySchema = z.object({
    file: z.any(),
})
export type UploadFileBody = z.infer<typeof uploadFileBodySchema>;