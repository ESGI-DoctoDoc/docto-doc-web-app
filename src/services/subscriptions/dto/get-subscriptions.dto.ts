import {z} from 'zod';

export const getSubscriptionsQuerySchema = z.object({
    page: z.number().optional(),
    size: z.number().optional(),
})
export type GetSubscriptionsQuery = z.infer<typeof getSubscriptionsQuerySchema>;

export const getSubscriptionsResponseSchema = z.array(z.object({
    id: z.string(),
    doctor: z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
    }),
    start: z.string(),
    end: z.string(),
    amount: z.number().nonnegative(),
    status: z.enum(['active', 'inactive', 'cancelled']),
    createdAt: z.string(),
})).nonempty({
    message: 'No subscriptions found',
})
export type GetSubscriptionsResponse = z.infer<typeof getSubscriptionsResponseSchema>;

export const getSubscriptionInvoiceSchema = z.object({
    invoiceUrl: z.string().url(),
});
export type GetSubscriptionInvoice = z.infer<typeof getSubscriptionInvoiceSchema>;