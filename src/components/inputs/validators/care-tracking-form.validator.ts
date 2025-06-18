import {z} from 'zod';

export const createCareTrackingSchema = z.object({
    name: z.string()
        .min(1, 'form.careTracking.name.required')
        .max(128, 'form.careTracking.name.max'),
    patient: z.string().uuid('form.careTracking.patient.invalid')
})
export type CreateCareTrackingForm = z.infer<typeof createCareTrackingSchema>;

export const updateCareTrackingSchema = z.object({
    name: z.string()
        .min(1, 'form.careTracking.name.required')
        .max(128, 'form.careTracking.name.max'),
});
export type UpdateCareTrackingForm = z.infer<typeof updateCareTrackingSchema>;