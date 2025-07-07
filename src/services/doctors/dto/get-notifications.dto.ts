import {z} from "zod";

export const fetchNotificationsResponseSchema = z.array(z.object({
    id: z.string(),
    title: z.string(),
    content: z.string().nullable().optional(),
    isRead: z.boolean(),
    createdAt: z.string(),
}));
export type FetchNotificationsResponse = z.infer<typeof fetchNotificationsResponseSchema>;