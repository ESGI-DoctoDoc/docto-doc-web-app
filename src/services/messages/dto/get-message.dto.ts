import { z } from 'zod';

export interface MessageCursor {
    sentAt: string;
    id: string;
}
export const messageSenderSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    avatarUrl: z.string().url(),
});

export const messageContentSchema = z.object({
    text: z.string().nullable(),
    files: z.array(z.string().url()),
});

export const getMessageResponseSchema = z.object({
    id: z.string().uuid(),
    sender: messageSenderSchema,
    content: messageContentSchema,
    sentAt: z.string(),
});

export const getMessagesResponseSchema = z.array(getMessageResponseSchema);

export type GetMessagesResponse = z.infer<typeof getMessagesResponseSchema>;

export const getMessageQuerySchema = z.object({
    cursorSentAt: z
        .string()
        .optional(),
    cursorId: z.string().uuid().optional(),
});

export type GetMessagesQuerySchema = z.infer<typeof getMessageQuerySchema>;