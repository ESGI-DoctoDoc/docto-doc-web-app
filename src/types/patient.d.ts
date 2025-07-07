import type {AppointmentStatus} from "~/types/appointment";

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

export interface PatientAppointment {
    id: string;
    date: string;
    startHour: string;
    endHour: string;
    status: AppointmentStatus;
    cancelledReason?: string;
    comment?: string;
}

export interface PatientDetails extends Patient {
    noShow: number;
    appointments: PatientAppointment[];
    files: string[];
}