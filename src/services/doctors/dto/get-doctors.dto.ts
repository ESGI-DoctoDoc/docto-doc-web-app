import {z} from 'zod';

export const getDoctorsQuerySchema = z.object({
    page: z.number().optional(),
    size: z.number().optional(),
    name: z.string().optional(),
})
export type GetDoctorsQuery = z.infer<typeof getDoctorsQuerySchema>;

const doctorSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    rpps: z.string().nullable().optional(),
    phone: z.string(),
    address: z.object({
        formatted: z.string(),
        latitude: z.number(),
        longitude: z.number(),
    }).nullable().optional(),
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
    isReported: z.boolean(),
    isEmailVerified: z.boolean(),
    files: z.array(z.string()).nullable().optional(),
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

export const getDoctorProfileResponseSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.object({
        formatted: z.string(),
        latitude: z.number(),
        longitude: z.number(),
    }).nullable().optional(),
    speciality: z.object({
        id: z.string(),
        name: z.string(),
    }),
    subscription: z.object({
        id: z.string(),
        start: z.string(),
        end: z.string(),
    }).nullable().optional(),
    bio: z.string().nullable().optional(),
    profilePictureUrl: z.string().nullable().optional(),
})
export type GetDoctorProfileResponse = z.infer<typeof getDoctorProfileResponseSchema>;

export const getDoctorsByNameResponseSchema = z.array(z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
    speciality: z.object({
        id: z.string(),
        name: z.string(),
    }),
    createdAt: z.string(),
}))
export type GetDoctorsByNameResponse = z.infer<typeof getDoctorsByNameResponseSchema>;
