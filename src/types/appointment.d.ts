export type AppointmentStatus = 'upcoming' | 'cancelled-excused' | 'cancelled-unexcused' | 'completed' | 'waiting-room';

export interface Appointment {
    id: string
    patient: {
        id: string
        name: string
        email: string
        phone: string
        birthdate: string
    }
    start: string
    startHour: string
    status: AppointmentStatus
    doctorNotes?: string
    createdAt: string
    updatedAt: string
}