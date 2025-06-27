import {z} from 'zod';

export const updateDoctorBodySchema = z.object({})
export type UpdateDoctorBody = z.infer<typeof updateDoctorBodySchema>;
