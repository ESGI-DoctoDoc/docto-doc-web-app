import {z} from "zod";

export interface OnboardingDto {
    rpps: string,
    specialty: string,
    experienceYears: number,
    acceptPublicCoverage: boolean,
    firstName: string,
    lastName: string,
    birthDate: string,
    bio: string,
    profilePictureUrl: string,
    languages: string[],
    doctorDocuments: string[]
}

export const onboardingBodySchema = z.object({
    rpps: z.string(),
    specialty: z.string(),
    experienceYears: z.number(),
    acceptPublicCoverage: z.boolean(),
    firstName: z.string(),
    lastName: z.string(),
    birthDate: z.string(),
    bio: z.string(),
    profilePictureUrl: z.string(),
    languages: z.array(z.string()),
    doctorDocuments: z.array(z.string().url()),
})

export type OnboardingBody = z.infer<typeof onboardingBodySchema>

export const onboardingResponseSchema = z.object({
    doctorId: z.string(),
})

export type OnboardingResponse = z.infer<typeof onboardingResponseSchema>