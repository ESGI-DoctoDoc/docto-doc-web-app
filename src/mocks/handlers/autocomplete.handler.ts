import {http, HttpResponse} from "msw";
import {resolveRequestMock} from "~/mocks/handlers/utils.mock";

export const autocompleteHandlers = [
    http.get('http://localhost:8080/api/v1/autocomplete/address', async () => {
        return HttpResponse.json(await resolveRequestMock([
            {
                formattedAddress: '123 Main St, Springfield, IL 62701, USA'
            },
            {
                formattedAddress: '123 Second St, Springfield, IL 62701, USA'
            },
            {
                formattedAddress: '456 Elm St, Springfield, IL 62701, USA'
            },
            {
                formattedAddress: '789 Oak St, Springfield, IL 62701, USA'
            }
        ]))
    }),
];