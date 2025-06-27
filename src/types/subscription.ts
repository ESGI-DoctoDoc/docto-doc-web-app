export interface Subscription {
    id: string;
    start: string;
    end: string;
    amount: number;
    status: 'active' | 'inactive' | 'cancelled';
}

export interface SubscriptionInvoice {
    invoiceUrl: string;
}