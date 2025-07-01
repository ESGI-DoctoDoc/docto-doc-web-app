import {http, HttpResponse} from "msw";
import {rejectRequestMock, resolveRequestMock} from "~/mocks/handlers/utils.mock";

export const mediaHandlers = [
    http.get('http://localhost:8080/api/v1/media/:id', async ({params}) => {
        const {id} = params;
        if (id === 'error') {
            return HttpResponse.json(await rejectRequestMock());
        }
        return HttpResponse.json(await resolveRequestMock({
            fileUrl: `https://fastly.picsum.photos/id/319/536/354.jpg?hmac=ZzEILWavlsP9MWDCsCqQp3fxsbmTD48rzZWY5c57IPU`,
        }, 3000));
    }),

    http.post('http://localhost:8080/api/v1/media', async () => {
        return HttpResponse.json(await resolveRequestMock({
            fileUrl: `https://fastly.picsum.photos/id/319/536/354.jpg?hmac=ZzEILWavlsP9MWDCsCqQp3fxsbmTD48rzZWY5c57IPU`,
        }, 3000));
    }),

    http.delete('http://localhost:8080/api/v1/media/:id', async ({params}) => {
        const {id} = params;
        if (id === 'error') {
            return HttpResponse.json(await rejectRequestMock());
        }
        return HttpResponse.json(await resolveRequestMock({}));
    }),
]