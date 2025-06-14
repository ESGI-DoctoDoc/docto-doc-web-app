export type genderType = 'MALE' | 'FEMALE'

export interface Patient {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    birthdate: string;
    phone: string;
    gender: genderType
    createdAt: string;
}