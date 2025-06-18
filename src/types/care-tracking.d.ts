export interface CareTracking {
    id: string;
    name: string;
    patient: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    }
    createdAt: string;
}