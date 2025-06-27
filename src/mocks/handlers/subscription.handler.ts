import {http, HttpResponse} from "msw";
import {resolveRequestMock} from "~/mocks/handlers/utils.mock";

export const subscriptionMockHandlers = [
    http.get('http://localhost:8080/api/v1/doctors/subscriptions', async () => {
        return HttpResponse.json(await resolveRequestMock([
            {
                id: 'cs_test_a1b2c3d4e5f6g7h8i9j1',
                start: '2023-02-01T00:00:00Z',
                end: '2024-02-01T00:00:00Z',
                amount: 200,
                status: 'active',
                createdAt: '2023-02-01T00:00:00Z',
            },
            {
                id: 'cs_test_a1b2c3d4e5f6g7h8i9j0',
                start: '2022-01-01T00:00:00Z',
                end: '2023-01-01T00:00:00Z',
                amount: 100,
                status: 'inactive',
                createdAt: '2023-01-01T00:00:00Z',
            },
        ]))
    }),
    http.post('http://localhost:8080/api/v1/doctors/subscriptions', async () => {
        return HttpResponse.json(await resolveRequestMock({
            redirectUrl: 'http://localhost:3000/my-calendar?session_id=cs_test_a1b2c3d4e5f6g7h8i9j0&success=true',
            // redirectUrl: 'http://localhost:3000/my-calendar?session_id=cs_test_a1b2c3d4e5f6g7h8i9j0&success=false',
        }))
    }),
    http.post('http://localhost:8080/api/v1/doctors/subscriptions/:uuid/confirm', async () => {
        return HttpResponse.json(await resolveRequestMock({}, 3000))
    }),
]