export interface DoctorNotification {
    id: string;
    title: string;
    content?: string | null;
    isRead: boolean;
    createdAt: string;
}