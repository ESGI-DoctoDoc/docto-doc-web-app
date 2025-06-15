import {http, HttpResponse} from "msw";
import {resolveRequestMock} from "~/mocks/handlers/utils.mock";

export const appointmentsMockHandlers = [
    http.get('http://localhost:8080/api/v1/appointments', async () => {
        return HttpResponse.json(await resolveRequestMock([
            {
                id: 'b5bbedc2-b469-460c-9174-336801abb8ef',
                patient: {
                    id: 'patient1',
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    phone: '+33675704647',
                    birthdate: '1990-01-01',
                },
                start: '2025-06-20T09:00:00Z',
                startHour: '09:00',
                status: 'upcoming',
                doctorNotes: 'Patient needs follow-up in 2 weeks.',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 'b5bbedc2-b469-460c-9174-336801abb8ed',
                patient: {
                    id: 'patient2',
                    name: 'Jane Smith',
                    email: 'jane.smith@example.com',
                    phone: '+33612345678',
                    birthdate: '1985-05-15',
                },
                start: '2025-06-18T14:00:00Z',
                startHour: '14:00',
                status: 'completed',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ]));
    }),
    http.get('http://localhost:8080/api/v1/appointments/:id', async ({params}) => {
        const {id} = params
        return HttpResponse.json(await resolveRequestMock({
            id,
            patient: {
                id: 'patient1',
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+33675704647',
                birthdate: '1990-01-01',
            },
            start: '2025-06-20T09:00:00Z',
            startHour: '09:00',
            status: 'upcoming',
            doctorNotes: 'Patient needs follow-up in 2 weeks.',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));
    }),
]