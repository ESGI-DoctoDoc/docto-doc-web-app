export enum SlotDay {
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday',
    SUNDAY = 'sunday',
}

export enum SlotRecurrence {
    NONE = 'none',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
}

interface SlotMedicalConcern {
    id: string;
    name: string;
    duration: number;
}

export interface Slot {
    id: string;
    date: string;
    day: SlotDay;
    dayNumber?: number;
    startHour: string;
    endHour: string;
    recurrence: SlotRecurrence;
}

export interface SlotDetail extends Slot {
    medicalConcerns: SlotMedicalConcern[];
    start?: string;
    end?: string;
    dayNumber?: number;
}