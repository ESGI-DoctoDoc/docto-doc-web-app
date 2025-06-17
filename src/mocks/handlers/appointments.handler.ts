import {http, HttpResponse} from "msw";
import {resolveRequestMock} from "~/mocks/handlers/utils.mock";

export const appointmentsMockHandlers = [
    http.get('http://localhost:8080/api/v1/doctors/appointments', async () => {
        return HttpResponse.json(await resolveRequestMock([
            {
                id: 'b5bbedc2-b469-460c-9174-336801abb8ea',
                patient: {
                    id: 'b5bbedc2-b469-460c-9174-336801abb8ea',
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    phone: '+33675704647',
                    birthdate: '1990-01-01',
                },
                medicalConcern: {
                    id: '922fe9be-7319-4aee-aabb-9a78cc9f6591',
                    name: 'Concern 1',
                },
                careTracking: null,
                answers: [
                    {
                        id: 'answer1',
                        answer: 'Yes',
                    },
                    {
                        id: 'answer2',
                        answer: 'No',
                    },
                ],
                start: '2025-06-20T09:00:00Z',
                startHour: '09:00',
                status: 'upcoming',
                doctorNotes: 'Patient needs follow-up in 2 weeks.',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 'b5bbedc2-b469-460c-9174-336801abb8f0',
                patient: {
                    id: 'patient2',
                    name: 'Jane Smith',
                    email: 'john.doe@example.com',
                    phone: '+33675704647',
                    birthdate: '1992-02-02',
                },
                medicalConcern: {
                    id: '922fe9be-7319-4aee-aabb-9a78cc9f6591',
                    name: 'Concern 2',
                },
                careTracking: null,
                answers: [
                    {
                        id: 'answer3',
                        answer: 'Maybe',
                    },
                ],
                start: '2025-06-21',
                startHour: '10:00',
                status: 'confirmed',
                doctorNotes: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ]));
    }),
    http.get('http://localhost:8080/api/v1/doctors/appointments/:id', async ({params}) => {
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