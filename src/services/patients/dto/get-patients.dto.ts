import {z} from 'zod';

export const getPatientsResponseSchema = z.array(
    z.object({
        id: z.string(),
        firstname: z.string(),
        lastname: z.string(),
        email: z.string().email(),
        phone: z.string(),
        birthdate: z.string(),
        gender: z.enum(['MALE', 'FEMALE']),
        createdAt: z.string(),
    })
)
export type GetPatientsResponse = z.infer<typeof getPatientsResponseSchema>


export const getPatientByIdResponseSchema = z.object({
    id: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    phone: z.string(),
    birthdate: z.string(),
    gender: z.enum(['MALE', 'FEMALE']),
    appointments: z.array(
        z.object({
            id: z.string(),
            date: z.string(),
            startHour: z.string(),
            endHour: z.string(),
            cancelledReason: z.string().nullable().optional(),
            comment: z.string().nullable().optional(),
            status: z.enum(['upcoming', 'cancelled-excused', 'cancelled-unexcused', 'completed', 'waiting-room']),
        })
    ),
    createdAt: z.string(),
})
export type GetPatientByIdResponse = z.infer<typeof getPatientByIdResponseSchema>