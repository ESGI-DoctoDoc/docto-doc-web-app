import {z} from 'zod';

export const getDoctorsQuerySchema = z.object({
    page: z.number().optional(),
    size: z.number().optional(),
})
export type GetDoctorsQuery = z.infer<typeof getDoctorsQuerySchema>;

const doctorSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
    speciality: z.object({
        id: z.string(),
        name: z.string(),
    }).nullable().optional(),
    birthdate: z.string().nullable().optional(),
    isVerified: z.boolean(),
    createdAt: z.string(),
})

export const getDoctorsResponseSchema = z.array(doctorSchema)
export type GetDoctorsResponse = z.infer<typeof getDoctorsResponseSchema>;

export const getDoctorByIdResponseSchema = doctorSchema.extend({
    isEmailVerified: z.boolean(),
    subscriptions: z.array(z.object({
        id: z.string(),
        start: z.string(),
        end: z.string(),
    })).nullable().optional(),
    counter: z.object({
        appointments: z.number(),
        patients: z.number(),
    }),
})
export type GetDoctorByIdResponse = z.infer<typeof getDoctorByIdResponseSchema>;