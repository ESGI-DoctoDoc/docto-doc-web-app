import {z} from 'zod';

export const getAppointmentsSchema = z.array(
    z.object({
        id: z.string(),
        patient: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            phone: z.string(),
            birthdate: z.string(),
        }),
        start: z.string(),
        startHour: z.string(),
        status: z.enum(['upcoming', 'past', 'cancelled', 'no-show']),
        doctorNotes: z.string().optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
)
export type GetAppointmentsResponse = z.infer<typeof getAppointmentsSchema>;