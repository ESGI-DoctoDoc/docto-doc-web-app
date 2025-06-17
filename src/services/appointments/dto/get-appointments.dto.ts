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
        status: z.enum(['upcoming', 'cancelled-excused', 'cancelled-unexcused', 'completed', 'waiting-room']),
        doctorNotes: z.union([z.string(), z.null()]).optional(),
        createdAt: z.string(),
    })
)
export type GetAppointmentsResponse = z.infer<typeof getAppointmentsSchema>;