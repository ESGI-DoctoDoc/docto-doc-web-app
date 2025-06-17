import {z} from 'zod';

export const cancelAppointmentBodySchema = z.object({
    reason: z.string().min(1, 'form.appointment.cancel.reason.required'),
});
export type CancelAppointmentBody = z.infer<typeof cancelAppointmentBodySchema>;