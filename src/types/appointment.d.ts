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
    status: 'upcoming' | 'past' | 'cancelled' | 'no-show'
    doctorNotes?: string
    createdAt: string
    updatedAt: string
}