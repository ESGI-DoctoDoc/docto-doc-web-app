import {z} from 'zod';

export interface GetCareTrackingDto {
    page?: number;
    size?: number;
    patientId?: string;
}

export const getCareTrackingsQuerySchema = z.object({
    page: z.number().optional(),
    size: z.number().optional(),
    name: z.string().optional(),
    patientId: z.string().optional(),
});
export type GetCareTrackingsQuery = z.infer<typeof getCareTrackingsQuerySchema>;

export const careTrackingDoctorSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    profilePictureUrl: z.string(),
});

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
    closedAt: z.string().nullable().optional(),
    createdAt: z.string(),
});

export const getCareTrackingByIdResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    owner: careTrackingDoctorSchema,
    patient: careTrackingPatientSchema,
    appointments: z.array(z.object({
        id: z.string(),
        medicalConcern: z.object({
            id: z.string(),
            name: z.string(),
        }),
        start: z.string(),
        startHour: z.string(),
        status: z.enum([
            'upcoming',
            'confirmed',
            'locked',
            'cancelled-excused',
            'cancelled-unexcused',
            'completed',
            'waiting-room',
        ]),
        doctorNotes: z.string().nullable().optional(),
    })).nullable(),
    doctors: z.array(careTrackingDoctorSchema),
    files: z.array(z.string()).nullable().optional(),
    closedAt: z.string().nullable().optional(),
    createdAt: z.string(),
});

export const getCareTrackingsResponseSchema = z.array(careTrackingSchema);
export type GetCareTrackingsResponse = z.infer<typeof getCareTrackingsResponseSchema>;
export type GetCareTrackingByIdResponse = z.infer<typeof getCareTrackingByIdResponseSchema>;

export const getCareTrackingsByPatientNameResponseSchema = z.array(z.object({
    id: z.string(),
    name: z.string(),
    patient: careTrackingPatientSchema,
    closedAt: z.string().nullable().optional(),
}));
export type GetCareTrackingsByPatientNameResponse = z.infer<typeof getCareTrackingsByPatientNameResponseSchema>;