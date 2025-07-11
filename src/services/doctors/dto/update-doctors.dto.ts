import {z} from 'zod';

export interface UpdateDoctorProfile {
    firstname: string;
    lastname: string;
    address: string;
    bio: string;
    profilePictureUrl?: string | null;
}

export const updateDoctorBodySchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    address: z.string(),
    bio: z.string(),
    profilePictureUrl: z.string().nullable().optional(),
})
export type UpdateDoctorBody = z.infer<typeof updateDoctorBodySchema>;
