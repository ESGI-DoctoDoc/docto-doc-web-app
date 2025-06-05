export interface QuestionOption {
    label: string;
    value: string;
}

export interface MedicalConcernQuestion {
    id: string;
    question: string;
    type: 'text' | 'list' | 'yes_no' | 'date';
    options?: QuestionOption[];
    isMandatory: boolean;
    createdAt: string;
}