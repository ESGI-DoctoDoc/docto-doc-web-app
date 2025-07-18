import type {AppointmentMedicalConcern, AppointmentStatus} from "~/types/appointment";

export type DocumentType = 'Rapport médical' | 'Ordonnance' | 'Certificat médical' | "Résultats d'analyses" | 'Autre'

export interface CareTrackingPatient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export interface CareTrackingDoctor {
    id: string;
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
}

export interface CareTrackingAppointment {
    id: string;
    medicalConcern: AppointmentMedicalConcern;
    start: string;
    date: string;
    startHour: string;
    endHour: string;
    status: AppointmentStatus;
    doctorNotes?: string | null;
}

export interface CareTrackingDetail {
    id: string;
    name: string;
    patient: CareTrackingPatient;
    appointments: CareTrackingAppointment[]
    doctors: CareTrackingDoctor[];
    closedAt?: string | null;
    files: string[];
    createdAt: string;
}

export interface CareTracking {
    id: string;
    name: string;
    description?: string | null;
    patient: CareTrackingPatient;
    owner: CareTrackingDoctor;
    closedAt?: string | null;
    createdAt: string;
}