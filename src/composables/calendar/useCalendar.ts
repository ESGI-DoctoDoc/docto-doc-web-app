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

    function convertDateToIsoString(day: string, hour: string): string {
        return dayjs()
            .set('day', convertDayToNumber(day))
            .set("hour", parseInt(hour.split(':')[0]))
            .set("minute", parseInt(hour.split(':')[1]))
            .toISOString();
    }

    function mapSlotToCalendarEvent(slot: Slot): EventSourceInput {
        const isRecurring = slot.recurrence !== 'none';

        return {
            id: slot.id,
            start: convertDateToIsoString(slot.day, slot.startHour),
            end: convertDateToIsoString(slot.day, slot.endHour),
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
                }
            }
        }

    }

    return {
        doctorSlotsTemplate,
        mapSlotToCalendarEvent,
        mapDoctorAbsenceToCalendarEvent,
    };
}