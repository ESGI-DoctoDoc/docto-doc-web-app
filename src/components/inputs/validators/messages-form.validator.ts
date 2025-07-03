import {z} from 'zod';

export const sendMessageSchema = z.object({
    message: z.string().max(256),
    files: z.array(z.string()),
}).superRefine((data, ctx) => {
    // message or files must be provided
    if (!data.message && data.files.length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'You must provide a message or at least one file.',
        });
    }
})
export type SendMessageForm = z.infer<typeof sendMessageSchema>;