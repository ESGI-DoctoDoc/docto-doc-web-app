import {z} from "zod";

export interface OtpDto {
    doubleAuthCode: string;
}

export const otpBodySchema = z.object({
    doubleAuthCode: z.string(),
})
export type OtpBody = z.infer<typeof otpBodySchema>

export const otpResponseSchema = z.object({
    id: z.string().nullable(),
    token: z.string(),
    hasOnBoardingDone: z.boolean(),
    email: z.string().nullable(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    phoneNumber: z.string().nullable(),
})
export type OtpResponse = z.infer<typeof otpResponseSchema>