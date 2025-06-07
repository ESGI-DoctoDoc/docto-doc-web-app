import dayjs from "dayjs"
import type {Slot} from "~/types/slot";
import 'dayjs/locale/fr'
import type {EventSourceInput} from "@fullcalendar/core";

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

    function mapSlotsToCalendarEvents(slots: Slot[]): EventSourceInput {
        const array = slots.map(mapSlotToCalendarEvent);
        return array as EventSourceInput;
    }

    return {
        doctorSlotsTemplate,
        mapSlotToCalendarEvent,
        mapSlotsToCalendarEvents,
    };
}