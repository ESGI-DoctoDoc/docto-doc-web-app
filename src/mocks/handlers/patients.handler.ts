import {http, HttpResponse} from "msw";
import {rejectRequestMock, resolveRequestMock} from "~/mocks/handlers/utils.mock";

export const patientsMockHandlers = [
    http.get('http://localhost:8080/api/v1/patients', async () => {
        return HttpResponse.json(await resolveRequestMock([
            {
                id: 'uuid1',
                firstname: 'John',
                lastname: 'Doe',
                email: 'jesaispas@myfes.fr',
                gender: 'MALE',
                phone: '+33675704647',
                birthdate: '1990-01-01',
                createdAt: new Date().toISOString(),
            },
            {
                id: 'uuid2',
                firstname: 'Jane',
                lastname: 'Doe',
                email: 'jesaispas@myfes.fr',
                gender: 'FEMALE',
                phone: '+33675704647',
                birthdate: '1992-02-02',
                createdAt: new Date().toISOString(),
            },
            {
                id: 'uuid3',
                firstname: 'Alice',
                lastname: 'Smith',
                email: 'jesaispas@myfes.fr',
                gender: 'MALE',
                phone: '+33675704647',
                birthdate: '1985-03-03',
                createdAt: new Date().toISOString(),
            },
        ]));
    }),
    http.get('http://localhost:8080/api/v1/patients/:id', async ({params}) => {
        const {id} = params
        if (id === 'uuid2') {
            return HttpResponse.json(await rejectRequestMock());
        }
        return HttpResponse.json(await resolveRequestMock({
            id,
            firstname: 'John',
            lastname: 'Doe',
            email: 'chasp@qqd.fr',
            gender: 'MALE',
            phone: '+33675704647',
            birthdate: '1985-03-03',
            appointments: [
                {
                    id: 'appointment1',
                    date: '2023-10-01',
                    startHour: '10:00',
                    endHour: '11:00',
                    status: 'upcoming',
                    cancelledReason: null,
                    comment: null,
                },
                {
                    id: 'appointment2',
                    date: '2023-10-02',
                    startHour: '12:00',
                    endHour: '13:00',
                    status: 'completed',
                    cancelledReason: null,
                    comment: ''
                },
                {
                    id: 'appointment3',
                    date: '2023-10-02',
                    startHour: '12:00',
                    endHour: '13:00',
                    status: 'cancelled-excused',
                    comment: 'Follow-up needed',
                    cancelledReason: null,
                },
            ],
            createdAt: new Date().toISOString(),
        }));
    }),
]