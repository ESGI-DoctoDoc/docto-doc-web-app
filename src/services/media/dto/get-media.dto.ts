import {z} from 'zod';

export const retrieveUrlResponseSchema = z.object({
    url: z.string(),
})
export type RetrieveUrlResponse = z.infer<typeof retrieveUrlResponseSchema>;

export const getFileResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    type: z.enum(['Rapport médical', 'Ordonnance', 'Certificat médical', "Résultats d'analyses", 'Autre']).optional(),
})
export type GetFileResponse = z.infer<typeof getFileResponseSchema>;