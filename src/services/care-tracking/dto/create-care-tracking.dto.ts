import {z} from 'zod';

export interface CreateCareTrackingDto {
    name: string;
    patientId: string;
}

export interface UpdateCareTrackingDto {
    id: string;
    name: string;
}

export const createCareTrackingBodySchema = z.object({
    name: z.string().min(1, 'form.careTracking.name.required'),
    patient: z.string().min(1, 'form.careTracking.patient.required'),
});
export type CreateCareTrackingBody = z.infer<typeof createCareTrackingBodySchema>;

export const updateCareTrackingBodySchema = z.object({
    name: z.string().min(1, 'form.careTracking.name.required'),
})
export type UpdateCareTrackingBody = z.infer<typeof updateCareTrackingBodySchema>;

