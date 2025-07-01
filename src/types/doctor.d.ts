export interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    rpps?: string | null;
    address?: {
        formatted: string;
        latitude: number;
        longitude: number;
    }
    speciality?: {
        id: string;
        name: string;
    } | null;
    birthdate?: string | null;
    isVerified: boolean;
    createdAt: string;
}

export interface DoctorDetail extends Doctor {
    isEmailVerified: boolean;
    subscriptions?: Array<{
        id: string;
        start: string;
        end: string;
    }> | null;
    counter: {
        appointments: number;
        patients: number;
    }
}