import {RequestBuilder} from "~/api/request-builder";
import {
    type CheckoutLicenseBody,
    checkoutLicenseBodySchema,
    type CheckoutLicenseResponse,
    checkoutLicenseResponseSchema
} from "~/services/subscriptions/dto/checkout-license.dto";
import type {AppPagination} from "~/api/app-pagination.type";
import {
    type GetSubscriptionInvoice,
    getSubscriptionInvoiceSchema,
    type GetSubscriptionsQuery,
    getSubscriptionsQuerySchema,
    type GetSubscriptionsResponse,
    getSubscriptionsResponseSchema
} from "~/services/subscriptions/dto/get-subscriptions.dto";

export const subscriptionApi = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const successUrl = `${origin}/my-calendar`;
    const cancelUrl = `${origin}/my-calendar`;
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`

    function getSubscriptions(requestDto: AppPagination<unknown>) {
        return new RequestBuilder(BASE_API_URL)
            .get('/doctors/subscriptions')
            .withQuery<GetSubscriptionsQuery>(getSubscriptionsQuerySchema)
            .withResponse<GetSubscriptionsResponse>(getSubscriptionsResponseSchema)
            .execute({
                query: {
                    page: requestDto.page,
                    size: requestDto.size
                }
            })
    }

    function getSubscriptionInvoice(subscriptionId: string) {
        return new RequestBuilder(BASE_API_URL)
            .get(`/doctors/subscriptions/${subscriptionId}/invoice`)
            .withResponse<GetSubscriptionInvoice>(getSubscriptionInvoiceSchema)
            .execute()
    }

    function checkoutLicense() {
        return new RequestBuilder(BASE_API_URL)
            .post('/doctors/subscriptions')
            .withBody<CheckoutLicenseBody>(checkoutLicenseBodySchema)
            .withResponse<CheckoutLicenseResponse>(checkoutLicenseResponseSchema)
            .execute({
                body: {
                    cancelUrl: cancelUrl,
                    successUrl: successUrl,
                }
            })
    }

    function checkoutLicenseConfirmation(sessionId: string) {
        return new RequestBuilder(BASE_API_URL)
            .post(`/doctors/subscriptions/${sessionId}/confirm`)
            .execute() as Promise<void>
    }

    return {
        checkoutLicense,
        checkoutLicenseConfirmation,
        getSubscriptions,
        getSubscriptionInvoice
    }
}