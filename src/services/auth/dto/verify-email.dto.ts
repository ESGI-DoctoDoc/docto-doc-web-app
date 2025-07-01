import {z} from "zod";

export const verifyEmailBodySchema = z.object({
    userId: z.string(),
})
export type VerifyEmailBody = z.infer<typeof verifyEmailBodySchema>