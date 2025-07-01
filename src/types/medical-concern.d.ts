import type {MedicalConcernQuestion} from "~/types/medical-concern-question";

export interface MedicalConcern {
    id: string;
    name: string;
    duration: number;
    price: number;
    questions: MedicalConcernQuestion[];
    createdAt: string;
    archivedAt?: string;
}