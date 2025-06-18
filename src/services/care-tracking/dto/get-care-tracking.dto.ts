import {z} from 'zod';

export const careTrackingPatientSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
});

export const careTrackingSchema = z.object({
    id: z.string(),
    name: z.string(),
    patient: careTrackingPatientSchema,
    createdAt: z.string(),
});

export const getCareTrackingsResponseSchema = z.array(careTrackingSchema);
export type GetCareTrackingsResponse = z.infer<typeof getCareTrackingsResponseSchema>;
export type CareTracking = z.infer<typeof careTrackingSchema>;

