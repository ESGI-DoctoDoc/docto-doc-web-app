import {z} from "zod";
import {UserMapperException} from "~/exceptions/user.exception";

export const UserSchema = z.object({
    userId: z.string().uuid(),
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    phone: z.string().length(10),
    role: z.enum(['doctor', 'admin']),
});

export type User = z.infer<typeof UserSchema>;

export function mapToUser(data: unknown): User {
    try {
        return UserSchema.parse(data);
    } catch(e) {
        console.debug(e);
        throw new UserMapperException();
    }
}