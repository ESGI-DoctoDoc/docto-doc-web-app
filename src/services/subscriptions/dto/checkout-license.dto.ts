import {z} from 'zod';

export const checkoutLicenseBodySchema = z.object({
    successUrl: z.string(),
    cancelUrl: z.string(),
    priceId: z.string(),
})
export type CheckoutLicenseBody = z.infer<typeof checkoutLicenseBodySchema>;

export const checkoutLicenseResponseSchema = z.object({
    redirectUrl: z.string(),
})
export type CheckoutLicenseResponse = z.infer<typeof checkoutLicenseResponseSchema>;
