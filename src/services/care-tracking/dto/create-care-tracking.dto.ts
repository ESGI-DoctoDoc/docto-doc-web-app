import {z} from 'zod';

export interface CreateCareTrackingDto {
    name: string;
    description: string;
    patientId: string;
}

export interface UpdateCareTrackingDto {
    id: string;
    name: string;
    description: string;
}

export const createCareTrackingBodySchema = z.object({
    name: z.string().min(1, 'form.careTracking.name.required'),
    description: z.string().min(1, 'form.careTracking.description.required'),
    patientId: z.string().min(1, 'form.careTracking.patient.required'),
});
export type CreateCareTrackingBody = z.infer<typeof createCareTrackingBodySchema>;

export const updateCareTrackingBodySchema = z.object({
    name: z.string().min(1, 'form.careTracking.name.required'),
    description: z.string().min(1, 'form.careTracking.description.required'),
})
export type UpdateCareTrackingBody = z.infer<typeof updateCareTrackingBodySchema>;

