export interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    rpps?: string | null;
    bio: string;
    files?: string[];
    address: {
        formatted: string;
        latitude: number;
        longitude: number;
    }
    speciality: {
        id: string;
        name: string;
    };
    birthdate?: string | null;
    isVerified: boolean;
    createdAt: string;
}

export interface DoctorDetail extends Doctor {
    isReported: boolean;
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
    speciality: {
        id: string;
        name: string;
    };
    subscription?: {
        id: string;
        start: string;
        end: string;
    } | null;
    bio?: string | null;
    profilePictureUrl?: string | null;
}

export interface DoctorReporting {
    id: string;
    reporter: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    }
    explanation: string;
    status: 'pending' | 'resolved' | 'rejected';
    createdAt: string;
}

export interface DoctorRecruitment {
    id: string;
    firstName: string;
    lastName: string;
    createdAt: string;
}