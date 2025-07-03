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
    status: 'active' | 'inactive' | 'expired' | 'payment_error';
}

export interface SubscriptionInvoice {
    invoiceUrl: string;
}