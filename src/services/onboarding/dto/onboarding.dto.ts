import {z} from "zod";

export interface OnboardingDto {
    rpps: string,
    speciality: string,
    experienceYears: number,
    acceptPublicCoverage: boolean,
    firstName: string,
    gender: "MALE" | "FEMALE",
    lastName: string,
    birthDate: string,
    bio: string,
    profilePictureUrl: string,
    languages: string[],
    doctorDocuments: string[],
    address: string,
}

export const onboardingBodySchema = z.object({
    rpps: z.string(),
    speciality: z.string(),
    experienceYears: z.number(),
    acceptPublicCoverage: z.boolean(),
    firstName: z.string(),
    lastName: z.string(),
    birthDate: z.string(),
    gender: z.enum(["MALE", "FEMALE"]),
    bio: z.string(),
    pictureDocumentId: z.string(),
    languages: z.array(z.string()),
    doctorDocuments: z.array(z.string()),
    address: z.string(),
})

export type OnboardingBody = z.infer<typeof onboardingBodySchema>

export const onboardingResponseSchema = z.object({
    doctorId: z.string(),
})

export type OnboardingResponse = z.infer<typeof onboardingResponseSchema>