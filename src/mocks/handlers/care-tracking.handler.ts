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
                id: '00000000-0000-0000-0000-000000000011',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+33675704647',
            },
            appointments: [
                {
                    id: 'apt-1',
                    medicalConcern: {
                        id: 'mc-1',
                        name: 'Suivi diabète'
                    },
                    start: new Date().toISOString(),
                    startHour: '10:00',
                    status: 'upcoming',
                    doctorNotes: 'Contrôle glycémie à faire',
                }
            ],
            files: [
                'https://picsum.photos/536/354',
                'https://www.gauntlet-rpg.com/uploads/7/7/8/1/77811662/pa_reference_sheet.pdf',
                'https://doctodoc-my-aws-bucket.s3.eu-west-1.amazonaws.com/patients/00000000-0000-0000-0000-000000000011/care_tracking/aa068dd8-b54e-40c0-a462-5dc9130f0586/74ef3b9b-d8dd-410c-a1f6-8f6ceb467745?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250706T151521Z&X-Amz-SignedHeaders=host&X-Amz-Credential=AKIASR74T34K726JRNQV%2F20250706%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Expires=3600&X-Amz-Signature=a8585ce49c824736c281423469a5bc915b79734e53598ee2aa3fac9d73eff9c3',
                'https://picsum.photos.fr',
            ],
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

