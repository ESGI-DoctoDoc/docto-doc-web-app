import {z} from 'zod';

export interface PreUploadFileDto {
    endPoint: string;
    filename: string;
    type?: 'Rapport médical' | 'Ordonnance' | 'Certificat médical' | "Résultats d'analyses" | 'Autre';
}

export const preUploadFileBodySchema = z.object({
    filename: z.string(),
    type: z.enum(['Rapport médical', 'Ordonnance', 'Certificat médical', "Résultats d'analyses", 'Autre']).optional(),
})
export type PreUploadFileBodySchema = z.infer<typeof preUploadFileBodySchema>;

export const preUploadFileResponseSchema = z.object({
    id: z.string(),
})
export type PreUploadFileResponseSchema = z.infer<typeof preUploadFileResponseSchema>;