import {z} from 'zod';

export interface CreateAppointmentDto {
    patientId: string
    medicalConcernId: string
    start: string
    startHour: string
    careTrackingId?: string
    notes?: string
    answers?: Array<{
        questionId: string
        answer: string
    }>
}

export interface UpdateAppointmentDto extends CreateAppointmentDto {
    id: string;
}

export const saveAppointmentFormSchema = z.object({
    patient: z.string().uuid('form.appointment.patient'),
    medicalConcern: z.string().uuid('form.appointment.medicalConcern'),
    start: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "form.appointment.start"),
    answers: z.array(z.object({
        questionId: z.string(),
        answer: z.string(),
    })),
    startHour: z
        .string()
        .trim()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "form.appointment.startHour"),
    careTracking: z.string().optional(),
    notes: z.string().trim().max(255, "form.appointment.notes.max").optional(),
})
export type CreateAppointmentForm = z.infer<typeof saveAppointmentFormSchema>;
export type UpdateAppointmentForm = z.infer<typeof saveAppointmentFormSchema>;