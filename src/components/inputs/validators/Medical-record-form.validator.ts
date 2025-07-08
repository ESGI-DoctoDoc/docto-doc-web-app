import {z} from "zod";

export const medicalRecordFormSchema = z.object({
    type: z.enum(['Rapport médical', 'Ordonnance', 'Certificat médical', "Résultats d'analyses", 'Autre']),
});
export type MedicalRecordForm = z.infer<typeof medicalRecordFormSchema>;