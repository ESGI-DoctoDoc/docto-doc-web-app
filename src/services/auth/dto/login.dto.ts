import {z} from "zod";
import {AuthMapperException} from "~/exceptions/auth.exception";

export const loginRequestSchema = z.object({
    identifier: z.string(),
    password: z.string(),
})
export type LoginRequest = z.infer<typeof loginRequestSchema>

export const loginResponseSchema = z.object({
    token: z.string(),
})
export type LoginResponse = z.infer<typeof loginResponseSchema>

export async function parseLoginResponse(response: unknown): Promise<LoginResponse> {
    try {
        return await loginResponseSchema.parseAsync(response);
    } catch (error) {
        console.debug(error);
        throw new AuthMapperException();
    }
}
