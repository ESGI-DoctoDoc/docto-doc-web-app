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
                extraParams: {
                    title: 'Ouverture récurrente mensuelle',
                    startHour: slot.startHour,
                    endHour: slot.endHour,
                    dayNumber: slot.dayNumber,
                }
            }
        }

        // is weekly recurrence
        return {
            id: slot.id,
            start: convertDateToIsoString(slot.date, slot.startHour),
            end: convertDateToIsoString(slot.date, slot.endHour),
            extraParams: {
                title: isRecurring ? 'Ouverture récurrente' : 'Ouverture',
                startHour: slot.startHour,
                endHour: slot.endHour,
            }
        };
    }

    function mapDoctorAbsenceToCalendarEvent(absence: Absence): EventInput {
        if (absence.date) {
            return {
                id: absence.id,
                start: convertDateToIsoString(absence.start!, absence.startHour!),
                end: convertDateToIsoString(absence.end!, absence.endHour!),
                extraParams: {
                    title: 'Absence journée',
                    description: absence.description?.slice(0, 30),
                    isFullDay: true,
                    createdAt: dayjs(absence.createdAt).toISOString(),
                }
            }
        } else {
            return {
                id: absence.id,
                start: convertDateToIsoString(absence.start!, absence.startHour!),
                end: convertDateToIsoString(absence.end!, absence.endHour!),
                extraParams: {
                    title: 'Absence',
                    startHour: absence.startHour || '',
                    endHour: absence.endHour || '',
                    description: absence.description?.slice(0, 30),
                    isFullDay: false,
                    createdAt: dayjs(absence.createdAt).toISOString(),
                }
            }
        }
    }

    function mapAppointmentToCalendarEvent(appointment: Appointment) {
        return {
            id: appointment.id,
            start: convertDateToIsoString(appointment.start, appointment.startHour),
            end: convertDateToIsoString(appointment.start, appointment.startHour), //todo donner la durée
            title: `RDV: ${appointment.patient.name}`,
            extraParams: {
                type: 'appointment',
                patientId: appointment.patient.id,
                medicalConcernId: appointment.medicalConcern.id,
                careTrackingId: appointment.careTracking?.id || null,
                notes: appointment.doctorNotes || '',
                answers: appointment.answers || [],
                status: appointment.status,
                createdAt: dayjs(appointment.createdAt).toISOString(),
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