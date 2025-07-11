import {z} from 'zod';

export interface UpdateDoctorProfile {
    firstname: string;
    lastname: string;
    address: string;
    bio: string;
    profilePictureUrl?: string;
}

export const updateDoctorBodySchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    address: z.string(),
    bio: z.string(),
    profilePictureUrl: z.string().optional(),
})
export type UpdateDoctorBody = z.infer<typeof updateDoctorBodySchema>;
