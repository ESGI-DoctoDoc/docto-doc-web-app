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

export interface DoctorProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: {
        formatted: string;
        latitude: number;
        longitude: number;
    } | null;
    speciality?: {
        id: string;
        name: string;
    } | null;
    subscription?: {
        id: string;
        start: string;
        end: string;
    } | null;
    bio?: string | null;
    profilePictureUrl?: string | null;
}