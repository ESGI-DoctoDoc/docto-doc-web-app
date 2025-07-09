import {z} from 'zod';

export const getPatientsQuerySchema = z.object({
    page: z.number().optional(),
    size: z.number().optional(),
    name: z.string().optional(),
})
export type GetPatientsQuerySchema = z.infer<typeof getPatientsQuerySchema>

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
            status: z.enum(['confirmed', 'upcoming', 'cancelled-excused', 'cancelled-unexcused', 'completed', 'waiting-room']),
        })
    ),
    createdAt: z.string(),
})
export type GetPatientByIdResponse = z.infer<typeof getPatientByIdResponseSchema>

export const getPatientsByNameResponseSchema = z.array(z.object({
    id: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    email: z.string(),
    phone: z.string(),
    gender: z.enum(['MALE', 'FEMALE']),
}))
export type GetPatientsByNameResponse = z.infer<typeof getPatientsByNameResponseSchema>