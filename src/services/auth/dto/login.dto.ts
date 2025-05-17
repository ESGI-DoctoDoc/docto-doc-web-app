import {z} from "zod";

export interface LoginDto {
    email: string;
    password: string;
}

export const loginBodySchema = z.object({
    identifier: z.string(),
    password: z.string(),
})
export type LoginBody = z.infer<typeof loginBodySchema>

export const loginResponseSchema = z.object({
    token: z.string(),
})
export type LoginResponse = z.infer<typeof loginResponseSchema>
