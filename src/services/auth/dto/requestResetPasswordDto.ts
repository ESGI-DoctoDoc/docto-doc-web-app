import {z} from "zod";

export interface RequestResetPasswordDto {
    email: string;
    verificationUrl: string;
}

export const requestResetPasswordBodySchema = z.object({
    email: z.string(),
    verificationUrl: z.string(),
})
export type RequestResetPasswordBody = z.infer<typeof requestResetPasswordBodySchema>;