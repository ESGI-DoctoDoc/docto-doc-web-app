import {z} from "zod";

export interface UpdatePasswordDto {
    newPassword: string,
    token: string,
}

export const updatePasswordBodySchema = z.object({
    newPassword: z.string(),
    token: z.string(),
})
export type UpdatePasswordBody = z.infer<typeof updatePasswordBodySchema>;
