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

    function convertDateToIsoString(day: string, hour: string, dayNumber?: number): string {
        const now = dayjs();

        if (typeof dayNumber === 'number') {
            const date = dayjs(`${now.year()}-${String(now.month() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}T${hour}`);
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

    function mapSlotToCalendarEvent(slot: Slot): EventSourceInput {
        const isRecurring = slot.recurrence !== 'none';

        // is monthly recurrence
        if (slot.recurrence === 'monthly' && slot.dayNumber) {
            return {
                id: slot.id,
                start: convertDateToIsoString(slot.day, slot.startHour, slot.dayNumber),
                end: convertDateToIsoString(slot.day, slot.endHour, slot.dayNumber),
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