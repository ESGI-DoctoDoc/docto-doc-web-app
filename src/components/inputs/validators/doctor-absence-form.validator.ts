import {z} from "zod";
import dayjs from "dayjs";

const hour = z
    .string()
    .trim()
    .regex(/^(?:([01]\d|2[0-3]):[0-5]\d)?$/, "form.slot.hour.outOfRange");

const startDate = z.string().trim()
const endDate = z.string().trim()

export const createDoctorAbsenceSchema = z.object({
    startHour: hour.optional(),
    endHour: hour.optional(),
    date: startDate.optional(), // single day or range
    start: startDate.optional(),
    end: endDate.optional(),
    description: z.string().trim().max(255, "form.doctorAbsence.description.max").optional(),
}).superRefine((data, ctx) => {
    const {date} = data;

    const isAllDay = !!date;

    if (isAllDay) {
        if (!date) {
            ctx.addIssue({
                path: ['date'],
                code: z.ZodIssueCode.custom,
                message: "form.doctorAbsence.date.required",
            })
        }
        if (dayjs(date).isBefore(dayjs(), 'day')) {
            ctx.addIssue({
                path: ['date'],
                code: z.ZodIssueCode.custom,
                message: "form.doctorAbsence.date.past",
            })
        }
    } else {
        const {startHour, endHour, start, end} = data;

        if (!start) {
            ctx.addIssue({
                path: ['start'],
                code: z.ZodIssueCode.custom,
                message: "form.doctorAbsence.start.required",
            });
        }
        if (!end) {
            ctx.addIssue({
                path: ['end'],
                code: z.ZodIssueCode.custom,
                message: "form.doctorAbsence.start.required",
            });
        }

        const startDate = dayjs(start)
            .set('hour', parseInt(startHour?.split(':')[0] || '0'))
            .set('minute', parseInt(startHour?.split(':')[1] || '0'));
        const endDate = dayjs(end)
            .set('hour', parseInt(endHour?.split(':')[0] || '0'))
            .set('minute', parseInt(endHour?.split(':')[1] || '0'));

        if (!startDate.isValid()) {
            ctx.addIssue({
                path: ['start'],
                code: z.ZodIssueCode.custom,
                message: "form.doctorAbsence.start.invalid",
            })
        }
        if (!endDate.isValid()) {
            ctx.addIssue({
                path: ['end'],
                code: z.ZodIssueCode.custom,
                message: "form.doctorAbsence.end.invalid",
            })
        }

        if (startDate.isAfter(endDate)) {
            ctx.addIssue({
                path: ['end'],
                code: z.ZodIssueCode.custom,
                message: "form.doctorAbsence.end.beforeStart",
            })
        }

        if (startDate.isBefore(dayjs(), 'day')) {
            ctx.addIssue({
                path: ['start'],
                code: z.ZodIssueCode.custom,
                message: "form.doctorAbsence.start.past",
            })
        }
    }
});
export type CreateDoctorAbsenceForm = z.infer<typeof createDoctorAbsenceSchema>;

export const updateDoctorAbsenceSchema = z.object({});
export type UpdateDoctorAbsenceForm = z.infer<typeof updateDoctorAbsenceSchema>;