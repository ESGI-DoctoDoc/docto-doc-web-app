import {http, HttpResponse} from "msw";
import {resolveRequestMock} from "~/mocks/handlers/utils.mock";

export const careTrackingMockHandlers = [
    http.get('http://localhost:8080/api/v1/doctors/care-tracking', async () => {
        return HttpResponse.json(await resolveRequestMock([
            {
                id: 'ct1',
                name: 'Suivi A',
                patient: {
                    id: 'b5bbedc2-b469-460c-9174-336801abb8ea',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '+33675704647',
                },
                createdAt: new Date().toISOString(),
            },
            {
                id: 'ct2',
                name: 'Suivi B',
                patient: {
                    id: 'b5bbedc2-b469-460c-9174-336801abb8eb',
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'jane.doe@example.com',
                    phone: '+33675704647',
                },
                createdAt: new Date().toISOString(),
            },
        ]));
    }),
    http.get('http://localhost:8080/api/v1/doctors/care-tracking/:id', async ({params}) => {
        const {id} = params;
        return HttpResponse.json(await resolveRequestMock({
            id,
            name: `Suivi ${id}`,
            patient: {
                id: 'b5bbedc2-b469-460c-9174-336801abb8ea',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+33675704647',
            },
            appointments: [],
            createdAt: new Date().toISOString(),
        }));
    }),
    http.post('http://localhost:8080/api/v1/doctors/care-trackings', async () => {
        return HttpResponse.json(await resolveRequestMock({}));
    }),
    http.put('http://localhost:8080/api/v1/doctors/care-tracking/:id', async () => {
        return HttpResponse.json(await resolveRequestMock({}));
    }),
    http.delete('http://localhost:8080/api/v1/doctors/care-tracking/:id', async () => {
        return HttpResponse.json(await resolveRequestMock({}));
    }),
];

