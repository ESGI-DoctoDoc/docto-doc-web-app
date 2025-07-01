import {http, HttpResponse} from "msw";
import {resolveRequestMock} from "~/mocks/handlers/utils.mock";

export const absencesMockHandlers = [
    http.get('http://localhost:8080/api/v1/doctors/absences', async () => {
        return HttpResponse.json(await resolveRequestMock([
            {
                id: 'uuid1',
                date: '',
                startHour: '09:00',
                endHour: '12:00',
                start: '2025-06-03',
                end: '2025-06-03',
                description: 'Absence due to personal reasons',
                createdAt: new Date().toISOString(),
            },
            {
                id: 'uuid2',
                date: undefined,
                startHour: '14:00',
                endHour: '17:00',
                start: '2025-06-05',
                end: '2025-06-06',
                description: 'Medical appointment',
                createdAt: new Date().toISOString(),
            },
            {
                id: 'uuid3',
                date: '2025-06-08',
                description: 'Sick leave',
                createdAt: new Date().toISOString(),
            },
        ]));
    }),
    http.post('http://localhost:8080/api/v1/doctors/absences', async () => {
        return HttpResponse.json(await resolveRequestMock({
            id: 'uuid1234',
            date: '2025-10-02',
            startHour: '14:00',
            endHour: '17:00',
            start: '2025-10-02T14:00:00Z',
            end: '2025-10-02T17:00:00Z',
            description: 'Medical appointment',
            createdAt: new Date().toISOString(),
        }));
    }),
]