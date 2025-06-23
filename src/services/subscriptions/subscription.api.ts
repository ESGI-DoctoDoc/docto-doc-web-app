import {RequestBuilder} from "~/api/request-builder";
import {
    type CheckoutLicenseBody,
    checkoutLicenseBodySchema,
    type CheckoutLicenseResponse,
    checkoutLicenseResponseSchema
} from "~/services/subscriptions/dto/checkout-license.dto";

export const subscriptionApi = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const successUrl = `${origin}/payment/success`;
    const cancelUrl = `${origin}/payment/cancel`;
    const defaultPriceId = "";
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`

    function checkoutLicense() {
        return new RequestBuilder(BASE_API_URL)
            .post('/doctors/subscriptions')
            .withBody<CheckoutLicenseBody>(checkoutLicenseBodySchema)
            .withResponse<CheckoutLicenseResponse>(checkoutLicenseResponseSchema)
            .execute({
                body: {
                    priceId: defaultPriceId,
                    cancelUrl: cancelUrl,
                    successUrl: successUrl,
                }
            })
    }

    function checkoutLicenseConfirmation(paymentId: string) {
        return new RequestBuilder(BASE_API_URL)
            .post(`/doctors/subscriptions/${paymentId}/confirm`)
            .execute() as Promise<void>
    }

    return {
        checkoutLicense,
        checkoutLicenseConfirmation,
    }
}