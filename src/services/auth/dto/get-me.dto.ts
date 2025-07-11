import {z} from "zod";

export const getDoctorMeSchema = z.object({
    user: z.object({
        id: z.string(),
        email: z.string().email(),
        role: z.enum(['admin', 'doctor', 'patient']),
        phoneNumber: z.string(),
        isEmailVerified: z.boolean(),
        isDoubleAuthActive: z.boolean(),
    }),
    doctor: z.object({
        id: z.string().nullable(),
        isVerified: z.boolean(),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        isOnboardingCompleted: z.boolean(),
        isLicenseActivated: z.boolean(),
        avatarUrl: z.string().nullable().optional(),
    }).nullable().optional(),
})
export type GetDoctorMeResponse = z.infer<typeof getDoctorMeSchema>
