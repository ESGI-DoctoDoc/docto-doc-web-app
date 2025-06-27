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
        id: z.string(),
        isVerified: z.boolean(),
        firstName: z.string(),
        lastName: z.string(),
        isOnboardingCompleted: z.boolean(),
        isLicenseActivated: z.boolean(),
    }).nullable().optional(),
})
export type GetDoctorMeResponse = z.infer<typeof getDoctorMeSchema>
