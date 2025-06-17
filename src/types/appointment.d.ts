export type AppointmentStatus =
    | 'upcoming'
    | 'confirmed'
    | 'locked'
    | 'cancelled-excused'
    | 'cancelled-unexcused'
    | 'completed'
    | 'waiting-room';

export interface AppointmentPatient {
    id: string
    name: string
    email: string
    phone: string
    birthdate: string
}

export interface AppointmentMedicalConcern {
    id: string
    name: string
}

export interface AppointmentCareTracking {
    id: string
    name: string
}

export interface AppointmentAnswer {
    id: string
    answer: string
}

export interface Appointment {
    id: string
    patient: AppointmentPatient
    medicalConcern: AppointmentMedicalConcern
    careTracking?: AppointmentCareTracking | null
    answers?: AppointmentAnswer[] | null
    start: string
    startHour: string
    status: AppointmentStatus
    doctorNotes?: string | null
    createdAt: string
}
