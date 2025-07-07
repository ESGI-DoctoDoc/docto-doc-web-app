import {z} from "zod";

export const medicalRecordFormSchema = z.object({
    type: z.string(),
    files: z.array(z.string()).min(1, "form.medical-records.files-required"),
});
export type MedicalRecordForm = z.infer<typeof medicalRecordFormSchema>;