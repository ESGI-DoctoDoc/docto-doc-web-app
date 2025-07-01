import {z} from 'zod';

export const saveAppointmentBodySchema = z.object({
    patientId: z.string().uuid('form.appointment.patient'),
    medicalConcernId: z.string().uuid('form.appointment.medicalConcern'),
    start: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "form.appointment.start"),
    startHour: z
        .string()
        .trim()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "form.appointment.startHour"),
    careTrackingId: z.string().optional(),
    notes: z.string().trim().max(255, "form.appointment.notes.max").optional(),
    answers: z.array(z.object({
        questionId: z.string(),
        answer: z.string(),
    })).optional(),
});
export type CreateAppointmentBody = z.infer<typeof saveAppointmentBodySchema>;
export type UpdateAppointmentBody = z.infer<typeof saveAppointmentBodySchema>;