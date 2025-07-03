import {z} from 'zod';

export const sendMessageSchema = z.object({
    message: z.string().max(256),
    files: z.array(z.string()),
})
export type SendMessageForm = z.infer<typeof sendMessageSchema>;