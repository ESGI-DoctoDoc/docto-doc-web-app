import { z } from 'zod';

export interface SendMessageDto {
    content: string;
}

export const sendMessageRequestSchema = z.object({
    content: z.string(),
});

export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;