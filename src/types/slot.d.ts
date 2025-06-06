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

export interface Slot {
    id: string;
}