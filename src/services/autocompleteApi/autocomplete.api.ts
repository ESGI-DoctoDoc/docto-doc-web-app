import {
    type FetchAddressAutocompleteQuery,
    fetchAddressAutocompleteQuerySchema,
    type FetchAddressAutocompleteResponse,
    fetchAddressAutocompleteResponseSchema
} from "~/services/autocompleteApi/dto/get-address-autocomplete.dto";
import {RequestBuilder} from "~/api/request-builder";

export const autocompleteApi = () => {
    const BASE_API_URL = `${import.meta.env.VITE_API_BASE}/v1`

    function fetchAddressAutocomplete(requestDto: { address: string }) {
        return new RequestBuilder(BASE_API_URL)
            .get('/autocomplete/address')
            .withQuery<FetchAddressAutocompleteQuery>(fetchAddressAutocompleteQuerySchema)
            .withResponse<FetchAddressAutocompleteResponse>(fetchAddressAutocompleteResponseSchema)
            .execute({
                query: {
                    address: requestDto.address
                }
            })
    }

    return {
        fetchAddressAutocomplete,
    }
}