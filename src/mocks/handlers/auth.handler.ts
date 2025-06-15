import {http, HttpResponse} from "msw";
import {resolveRequestMock} from "~/mocks/handlers/utils.mock";

export const authMockHandlers = [
    http.post('http://localhost:8080/api/login', async () => {
        return HttpResponse.json(resolveRequestMock({}));
    }),
]