export interface User {
    userId: string;
    hasOnBoardingDone: boolean;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    role: 'doctor' | 'admin';
}

export function mapToUser(data: unknown): User {
    try {
        const userParsed = UserSchema.parse(data);
        return {
            userId: userParsed.userId,
            firstname: userParsed.firstname,
            lastname: userParsed.lastname,
            email: userParsed.email,
            phone: userParsed.phone,
            role: userParsed.role,
        }
    } catch(e) {
        console.debug(e);
        throw new UserMapperException();
    }
}