import dayjs from "dayjs"
import type {Slot} from "~/types/slot";
import 'dayjs/locale/fr'
import type {EventApi, EventInput} from "@fullcalendar/core";
import type {Absence} from "~/types/absence";
import type {Appointment} from "~/types/appointment";

dayjs.locale('fr');

export const useCalendar = () => {
    const doctorSlotsTemplate = useState<EventInput[]>('doctorSlotsTemplate', () => {
        return [];
    })

    function convertDateToIsoString(date: string, hour: string): string {
        return dayjs(date)
            .set('hour', parseInt(hour.split(':')[0]))
            .set('minute', parseInt(hour.split(':')[1]))
            .toISOString();
    }

    function mapSlotToCalendarEvent(slot: Slot): EventInput {
        const isRecurring = slot.recurrence !== 'none';

        // is monthly recurrence
        if (slot.recurrence === 'monthly' && slot.dayNumber) {
            return {
                id: slot.id,
                start: convertDateToIsoString(slot.date, slot.startHour),
                end: convertDateToIsoString(slot.date, slot.endHour),
                className: 'monthly-recurrence',
                extraParams: {
                    type: 'monthly-recurrence',
                    slot: slot,
                }
            }
        }

        // is weekly recurrence
        return {
            id: slot.id,
            start: convertDateToIsoString(slot.date, slot.startHour),
            end: convertDateToIsoString(slot.date, slot.endHour),
            className: isRecurring ? 'weekly-recurrence' : 'single-slot',
            extraParams: {
                type: isRecurring ? 'weekly-recurrence' : 'single-slot',
                slot: slot,
            }
        }
    }

    function mapDoctorAbsenceToCalendarEvent(absence: Absence): EventInput {
        if (absence.date) {
            return {
                id: absence.id,
                start: convertDateToIsoString(absence.start!, absence.startHour!),
                end: convertDateToIsoString(absence.end!, absence.endHour!),
                className: 'full-day-absence',
                extraParams: {
                    type: 'full-day-absence',
                    absence: absence,
                }
            }
        } else {
            return {
                id: absence.id,
                start: convertDateToIsoString(absence.start!, absence.startHour!),
                end: convertDateToIsoString(absence.end!, absence.endHour!),
                className: 'partial-day-absence',
                extraParams: {
                    type: 'partial-day-absence',
                    absence: absence,
                }
            }
        }
    }

    function mapAppointmentToCalendarEvent(appointment: Appointment): EventInput {
        return {
            id: appointment.id,
            start: convertDateToIsoString(appointment.start, appointment.startHour),
            end: convertDateToIsoString(appointment.start, appointment.endHour),
            className: `appointment-${appointment.status}`,
            extraParams: {
                type: 'appointment',
                appointment,
            }
        }
    }

    function mapCalendarEventToDoctorAbsence(event: EventApi): Absence {
        const params = event?.extendedProps?.extraParams || {};
        const isFullDay = params?.isFullDay;

        if (isFullDay === true) {
            return {
                id: event.id || '',
                date: dayjs(event.start).format('YYYY-MM-DD'),
                description: params?.description || '',
                createdAt: dayjs(params?.createdAt).toISOString(),
            }
        } else {
            return {
                id: event.id || '',
                date: '',
                startHour: params?.startHour || '',
                endHour: params?.endHour || '',
                start: dayjs(event.start).format('YYYY-MM-DD'),
                end: dayjs(event.end).format('YYYY-MM-DD'),
                description: params?.description || '',
                createdAt: dayjs(params?.createdAt).toISOString(),
            }
        }
    }

    return {
        doctorSlotsTemplate,
        convertDateToIsoString,
        mapSlotToCalendarEvent,
        mapDoctorAbsenceToCalendarEvent,
        mapCalendarEventToDoctorAbsence,
        mapAppointmentToCalendarEvent,
    };
}