export interface Subscription {
    id: string;
    doctor: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    start: string;
    end: string;
    amount: number;
    status: 'active' | 'inactive' | 'cancelled';
}

export interface SubscriptionInvoice {
    invoiceUrl: string;
}