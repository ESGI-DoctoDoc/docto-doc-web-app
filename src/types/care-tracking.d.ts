import type {AppointmentMedicalConcern, AppointmentStatus} from "~/types/appointment";

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
    files: string[];
    createdAt: string;
}

export interface CareTracking {
    id: string;
    name: string;
    description?: string | null;
    patient: CareTrackingPatient;
    endedAt?: string | null;
    createdAt: string;
}