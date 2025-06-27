import {http, HttpResponse} from "msw";
import {resolveRequestMock} from "~/mocks/handlers/utils.mock";
import type {Doctor, DoctorDetail} from "~/types/doctor";

export const doctorsMockHandlers = [
    http.get('http://localhost:8080/api/v1/doctors', async () => {
        return HttpResponse.json(await resolveRequestMock([
            {
                id: 'doctor1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'j.doe@example.com',
                phone: '+33612345678',
                rpps: "345654345678",
                speciality: {
                    id: 'spec1',
                    name: 'Cardiology'
                },
                birthdate: '1980-01-01',
                isVerified: true,
                createdAt: '2023-01-01T12:00:00Z',
            },
            {
                id: 'doctor2',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'j.smith@example.com',
                rpps: "345654345678",
                phone: '+33687654321',
                speciality: {
                    id: 'spec2',
                    name: 'Dermatology'
                },
                birthdate: '1985-05-15',
                isVerified: false,
                createdAt: '2023-02-01T12:00:00Z',
            },
        ] satisfies Doctor[]))
    }),
    http.get('http://localhost:8080/api/v1/doctors/:doctorId', async () => {
        return HttpResponse.json(await resolveRequestMock({
            id: 'doctor1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'j.doe@example.com',
            phone: '+33612345678',
            rpps: "10010377272",
            speciality: {
                id: 'spec1',
                name: 'Cardiology'
            },
            birthdate: '1980-01-01',
            isVerified: false,
            createdAt: '2023-01-01T12:00:00Z',
            isEmailVerified: true,
            subscriptions: [
                {
                    id: 'sub1',
                    start: '2023-01-01',
                    end: '2023-12-31'
                }
            ],
            counter: {
                appointments: 120,
                patients: 45
            }
        } satisfies DoctorDetail))
    })
]