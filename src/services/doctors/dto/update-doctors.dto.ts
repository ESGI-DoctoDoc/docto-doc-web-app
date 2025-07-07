import {z} from 'zod';

export interface UpdateDoctorProfile {
    firstname: string;
    lastname: string;
    address: string;
    bio: string;
}

export const updateDoctorBodySchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    address: z.string(),
    bio: z.string(),
})
export type UpdateDoctorBody = z.infer<typeof updateDoctorBodySchema>;
