import {z} from "zod";

export interface RegisterDto {
    email: string;
    password: string;
    phoneNumber: string;
}

export const registerBodySchema = z.object({
    email: z.string(),
    password: z.string(),
    phoneNumber: z.string(),
    verificationUrl: z.string(),
})
export type RegisterBody = z.infer<typeof registerBodySchema>