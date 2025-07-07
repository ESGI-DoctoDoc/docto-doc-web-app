import {z} from 'zod';

export interface SendMessageDto {
    content?: string;
    files?: string[];
}

export const sendMessageRequestSchema = z.object({
    content: z.string().optional(),
    files: z.array(z.string()).optional()
});

export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;