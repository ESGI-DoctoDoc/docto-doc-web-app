import {z} from 'zod';

export interface GetCareTrackingDto {
    page?: number;
    size?: number;
    patientId?: string;
}

export const getCareTrackingsQuerySchema = z.object({
    page: z.number().optional(),
    size: z.number().optional(),
})
export type GetCareTrackingsQuery = z.infer<typeof getCareTrackingsQuerySchema>;

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

export const getCareTrackingByIdResponseSchema = careTrackingSchema.extend({
    appointments: z.array(z.object({
        id: z.string(),
        medicalConcern: z.object({
            id: z.string(),
            name: z.string(),
        }),
        start: z.string(),
        startHour: z.string(),
        status: z.enum(['upcoming', 'confirmed', 'locked', 'cancelled-excused', 'cancelled-unexcused', 'completed', 'waiting-room']),
        doctorNotes: z.string().nullable().optional(),
    })),
})

export const getCareTrackingsResponseSchema = z.array(careTrackingSchema);
export type GetCareTrackingsResponse = z.infer<typeof getCareTrackingsResponseSchema>;
export type GetCareTrackingByIdResponse = z.infer<typeof getCareTrackingByIdResponseSchema>

