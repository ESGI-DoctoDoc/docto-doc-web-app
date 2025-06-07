export interface AbsenceDay {
    date: string;
}

export interface AbsenceRange {
    startHour?: string;
    endHour?: string;
    start?: string;
    end?: string;
}

export interface Absence extends AbsenceDay, AbsenceRange {
    id: string;
    description?: string;
    createdAt: string;
}