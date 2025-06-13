import dayjs from "dayjs"
import type {Slot} from "~/types/slot";
import 'dayjs/locale/fr'
import type {EventSourceInput} from "@fullcalendar/core";
import type {Absence} from "~/types/absence";

dayjs.locale('fr');

export const useCalendar = () => {
    const doctorSlotsTemplate = useState<EventSourceInput>('doctorSlotsTemplate', () => {
        return [];
    })

    function convertDayToNumber(day: string): number {
        switch (day) {
            case 'monday':
                return 1;
            case 'tuesday':
                return 2;
            case 'wednesday':
                return 3;
            case 'thursday':
                return 4;
            case 'friday':
                return 5;
            case 'saturday':
                return 6;
            case 'sunday':
                return 0;
            default:
                throw new Error(`Invalid day: ${day}`);
        }
    }

    function convertDateToIsoString(day: string, hour: string, dayNumber?: number, compareTo?: string): string {
        const now = compareTo ? dayjs(compareTo) : dayjs();

        if (typeof dayNumber === 'number') {
            const date = dayjs(compareTo)
                .day(convertDayToNumber(day))
                .set('hour', parseInt(hour.split(':')[0]))
                .set('minute', parseInt(hour.split(':')[1]))
            return date.toISOString();
        }

        const targetDay = convertDayToNumber(day);
        const baseDate = now.startOf('week'); // Sunday by default

        const date = baseDate.add(targetDay, 'day')
            .set("hour", parseInt(hour.split(':')[0]))
            .set("minute", parseInt(hour.split(':')[1]))
            .set("second", 0)
            .set("millisecond", 0);

        return date.toISOString();
    }

    function mapSlotToCalendarEvent(slot: Slot, compareTo: string): EventSourceInput {
        const isRecurring = slot.recurrence !== 'none';

        // is monthly recurrence
        if (slot.recurrence === 'monthly' && slot.dayNumber) {
            return {
                id: slot.id,
                start: convertDateToIsoString(slot.day, slot.startHour, slot.dayNumber, compareTo),
                end: convertDateToIsoString(slot.day, slot.endHour, slot.dayNumber, compareTo),
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
            start: convertDateToIsoString(slot.day, slot.startHour, undefined, compareTo),
            end: convertDateToIsoString(slot.day, slot.endHour, undefined, compareTo),
            extraParams: {
                title: isRecurring ? 'Ouverture récurrente' : 'Ouverture',
                startHour: slot.startHour,
                endHour: slot.endHour,
            }
        };
    }

    function mapDoctorAbsenceToCalendarEvent(absence: Absence): EventSourceInput {
        if (absence.date) {
            return {
                id: absence.id,
                start: dayjs(absence.date).startOf('day').toISOString(),
                end: dayjs(absence.date).endOf('day').toISOString(),
                extraParams: {
                    title: 'Absence journée',
                    description: absence.description?.slice(0, 30),
                    isFullDay: true,
                    createdAt: dayjs(absence.createdAt).toISOString(),
                }
            }
        } else {
            const formatDate = (date: string, hours: string) => dayjs(date)
                .set('hour', hours ? parseInt(hours.split(':')[0]) : 0)
                .set('minute', hours ? parseInt(hours.split(':')[1]) : 0);

            return {
                id: absence.id,
                start: formatDate(absence.start!, absence.startHour!).toISOString(),
                end: formatDate(absence.end!, absence.endHour!).toISOString(),
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

    function mapCalendarEventToDoctorAbsence(event: EventSourceInput): Absence {
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
        mapSlotToCalendarEvent,
        mapDoctorAbsenceToCalendarEvent,
        mapCalendarEventToDoctorAbsence,
    };
}