import {z} from 'zod';

export interface GetAppointmentsOnAbsenceDto {
    start: string
    startHour: string
    end: string
    endHour: string
}

export const getAppointmentsOnDateAbsenceBodySchema = z.object({
    date: z.string(),
})
export type GetAppointmentsOnDateAbsenceBody = z.infer<typeof getAppointmentsOnDateAbsenceBodySchema>;

export const getAppointmentsOnAbsenceBodySchema = z.object({
    start: z.string(),
    startHour: z.string(),
    end: z.string(),
    endHour: z.string(),
})
export type GetAppointmentsOnAbsenceBody = z.infer<typeof getAppointmentsOnAbsenceBodySchema>;

export const getAppointmentsOnAbsenceResponseSchema = z.array(z.object({
    id: z.string(),
    patient: z.object({
        id: z.string(),
        name: z.string(),
    }),
    start: z.string(),
    startHour: z.string(),
    endHour: z.string(),
}))
export type GetAppointmentsOnAbsenceResponse = z.infer<typeof getAppointmentsOnAbsenceResponseSchema>;