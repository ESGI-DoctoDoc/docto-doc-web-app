import {z} from "zod";

export const fetchAddressAutocompleteQuerySchema = z.object({
    address: z.string(),
});
export type FetchAddressAutocompleteQuery = z.infer<typeof fetchAddressAutocompleteQuerySchema>;

export const fetchAddressAutocompleteResponseSchema = z.array(z.object({
    formattedAddress: z.string(),
}))
export type FetchAddressAutocompleteResponse = z.infer<typeof fetchAddressAutocompleteResponseSchema>;