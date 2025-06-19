import {z} from 'zod';

export interface GetAppointmentsDto {
    startDate?: string;
}

export const getAppointmentsQuerySchema = z.object({
    startDate: z.string().optional(),
})
export type GetAppointmentsQuery = z.infer<typeof getAppointmentsQuerySchema>;

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
        medicalConcern: z.object({
            id: z.string(),
            name: z.string(),
        }),
        careTracking: z
            .object({
                id: z.string(),
                name: z.string(),
            })
            .nullable()
            .optional(),
        answers: z
            .array(
                z.object({
                    id: z.string(),
                    answer: z.string(),
                })
            )
            .nullable()
            .optional(),
        start: z.string(),
        startHour: z.string(),
        status: z.enum([
            'upcoming',
            'confirmed',
            'locked',
            'cancelled-excused',
            'cancelled-unexcused',
            'completed',
            'waiting-room'
        ]),
        doctorNotes: z.union([z.string(), z.null()]).optional(),
        createdAt: z.string(),
    })
)
export type GetAppointmentsResponse = z.infer<typeof getAppointmentsSchema>;

export const getAppointmentByIdResponseSchema = z.object({
    id: z.string(),
    patient: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        birthdate: z.string(),
    }),
    medicalConcern: z.object({
        id: z.string(),
        name: z.string(),
    }),
    careTracking: z
        .object({
            id: z.string(),
            name: z.string(),
        })
        .nullable()
        .optional(),
    answers: z
        .array(
            z.object({
                id: z.string(),
                answer: z.string(),
            })
        )
        .nullable()
        .optional(),
    start: z.string(),
    startHour: z.string(),
    status: z.enum([
        'upcoming',
        'confirmed',
        'locked',
        'cancelled-excused',
        'cancelled-unexcused',
        'completed',
        'waiting-room'
    ]),
    doctorNotes: z.union([z.string(), z.null()]).optional(),
    createdAt: z.string(),
})
export type GetAppointmentByIdResponse = z.infer<typeof getAppointmentByIdResponseSchema>;