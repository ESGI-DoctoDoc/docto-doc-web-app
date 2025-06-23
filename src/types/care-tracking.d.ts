import type {AppointmentMedicalConcern, AppointmentStatus} from "~/types/appointment";

export interface CareTrackingPatient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export interface CareTrackingAppointment {
    id: string;
    medicalConcern: AppointmentMedicalConcern;
    start: string;
    startHour: string;
    status: AppointmentStatus;
    doctorNotes?: string | null;
}

export interface CareTrackingDetail {
    id: string;
    name: string;
    patient: CareTrackingPatient;
    appointments: CareTrackingAppointment[]
    createdAt: string;
}

export interface CareTracking {
    id: string;
    name: string;
    patient: CareTrackingPatient;
    createdAt: string;
}