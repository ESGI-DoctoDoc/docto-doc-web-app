import {z} from "zod";

export const createDoctorAbsenceSchema = z.object({});
export type CreateDoctorAbsenceForm = z.infer<typeof createDoctorAbsenceSchema>;

export const updateDoctorAbsenceSchema = z.object({});
export type UpdateDoctorAbsenceForm = z.infer<typeof updateDoctorAbsenceSchema>;