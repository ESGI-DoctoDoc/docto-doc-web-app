import {z} from "zod";
import dayjs from "dayjs";

const hour = z
    .string()
    .trim()
    .min(5, "form.slot.hour.required")
    .max(5, "form.slot.hour.outOfRange")
    .regex(/^(0[7-9]|1[0-9]|2[0-2]):[0-5][0-9]$/, "form.slot.hour.outOfRange");

const day = z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
const startHour = hour;
const endHour = hour;
const recurrence = z.enum(['none', 'weekly', 'monthly']);
const startDate = z.string().trim()
const endDate = z.string().trim()

const medicalConcernIds = z
    .array(z.string().uuid())
    .min(1, "form.slot.medical-concern.required")

export const createSlotSchema = z.object({
    day: day.optional(),
    startHour: startHour,
    endHour: endHour,
    recurrence: recurrence,
    start: startDate.optional(),
    end: endDate.optional(),
    dayNumber: z.number().min(0).max(31).optional(),
    medicalConcerns: medicalConcernIds,
}).superRefine((data, ctx) => {
    const {startHour, endHour, recurrence, start, end, dayNumber} = data;

    // 1. Vérifier que l'heure de fin est après l'heure de début
    const startTime = dayjs(`2020-01-01T${startHour}`);
    const endTime = dayjs(`2020-01-01T${endHour}`);
    if (!endTime.isAfter(startTime)) {
        ctx.addIssue({
            path: ['endHour'],
            code: z.ZodIssueCode.custom,
            message: "form.slot.hour.afterStart",
        });
    }

    // 2. Vérifier qu'il y a au moins 15 minutes entre début et fin
    if (endTime.diff(startTime, 'minute') < 15) {
        ctx.addIssue({
            path: ['endHour'],
            code: z.ZodIssueCode.custom,
            message: "form.slot.hour.minDuration",
        });
    }

    // 3. Si une récurrence est définie (autre que "none")
    if (recurrence !== 'none') {
        const now = dayjs().startOf('day');
        const startDate = dayjs(start);

        // 3.1. La date de début doit être aujourd'hui ou dans le futur
        if (startDate.isBefore(now)) {
            ctx.addIssue({
                path: ['start'],
                code: z.ZodIssueCode.custom,
                message: "form.slot.start-date.future",
            });
        }

        if (!end) {
            ctx.addIssue({
                path: ['end'],
                code: z.ZodIssueCode.custom,
                message: "form.slot.end-date.required",
            })
        }
        const endDate = dayjs(end);

        // 3.2. La date de fin doit être après la date de début
        if (endDate.isBefore(startDate)) {
            ctx.addIssue({
                path: ['end'],
                code: z.ZodIssueCode.custom,
                message: "form.slot.end-date.afterStart",
            });
        }

        // 3.3. La date de fin doit couvrir au moins un cycle complet
        const minEndDate = recurrence === 'weekly'
            ? startDate.add(6, 'day')
            : recurrence === 'monthly'
                ? startDate.add(1, 'month').subtract(1, 'day')
                : startDate;

        if (endDate.isBefore(minEndDate)) {
            ctx.addIssue({
                path: ['end'],
                code: z.ZodIssueCode.custom,
                message: "form.slot.end-date.recurrenceTooShort",
            });
        }

        // 3.4. Pour les récurrences mensuelles, vérifier que dayNumber est défini et dans la plage valide
        if (recurrence === 'monthly') {
            if (dayNumber === undefined || dayNumber < 1 || dayNumber > 31) {
                ctx.addIssue({
                    path: ['dayNumber'],
                    code: z.ZodIssueCode.custom,
                    message: "form.slot.day-number.invalid",
                });
            }
        }
    }
});
export type CreateSlotForm = z.infer<typeof createSlotSchema>;

export const updateSlotSchema = z.object({
    startHour: startHour,
    endHour: endHour,
    medicalConcerns: medicalConcernIds,
}).superRefine((data, ctx) => {
    const {startHour, endHour} = data;

    const startTime = dayjs(`2020-01-01T${startHour}`);
    const endTime = dayjs(`2020-01-01T${endHour}`);

    // 1. Vérifier que l'heure de fin est après l'heure de début
    if (!endTime.isAfter(startTime)) {
        ctx.addIssue({
            path: ['endHour'],
            code: z.ZodIssueCode.custom,
            message: "form.slot.hour.afterStart",
        });
    }

    // 2. Vérifier qu'il y a au moins 15 minutes entre début et fin
    if (endTime.diff(startTime, 'minute') < 15) {
        ctx.addIssue({
            path: ['endHour'],
            code: z.ZodIssueCode.custom,
            message: "form.slot.hour.minDuration",
        });
    }
});
export type UpdateSlotForm = z.infer<typeof updateSlotSchema>;
