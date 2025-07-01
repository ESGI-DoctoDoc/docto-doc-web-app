import {http, HttpResponse} from "msw";
import {resolveRequestMock} from "~/mocks/handlers/utils.mock";
import type {SlotAvailable} from "~/types/slot-available";

export const slotsMockHandlers = [
    http.get('http://localhost:8080/api/v1/patients/doctors/medical-concerns/922fe9be-7319-4aee-aabb-9a78cc9f6591/get-appointments-availability?date=2025-06-16', async () => {
        return HttpResponse.json(await resolveRequestMock([
            {
                id: 'slot-1',
                date: '2025-10-02',
                start: '09:00',
                end: '09:30',
                isBooked: false,
            },
            {
                id: 'slot-2',
                date: '2025-10-02',
                start: '09:30',
                end: '10:00',
                isBooked: false,
            },
            {
                id: 'slot-3',
                date: '2025-10-02',
                start: '10:00',
                end: '10:30',
                isBooked: true,
            },
            {
                id: 'slot-4',
                date: '2025-10-02',
                start: '10:30',
                end: '11:00',
                isBooked: false,
            },
            {
                id: 'slot-5',
                date: '2025-10-02',
                start: '11:00',
                end: '11:30',
                isBooked: false,
            }
        ] satisfies SlotAvailable[]))
    }),
    // http.get('http://localhost:8080/api/v1/doctors/slots', async () => {
    //     return HttpResponse.json(await resolveRequestMock([
    //         {
    //             id: 'slot-1',
    //             day: 'monday',
    //             startHour: '09:00',
    //             endHour: '12:00',
    //             recurrence: 'weekly',
    //         },
    //         {
    //             id: 'slot-2',
    //             day: 'monday',
    //             startHour: '14:00',
    //             endHour: '17:00',
    //             recurrence: 'weekly',
    //         },
    //         {
    //             id: 'slot-3',
    //             day: 'tuesday',
    //             startHour: '10:00',
    //             endHour: '13:00',
    //             recurrence: 'weekly',
    //         },
    //         {
    //             id: 'slot-4',
    //             day: 'wednesday',
    //             startHour: '08:30',
    //             endHour: '12:30',
    //             recurrence: 'weekly',
    //         },
    //         {
    //             id: 'slot-5',
    //             day: 'thursday',
    //             startHour: '14:00',
    //             endHour: '18:00',
    //             recurrence: 'weekly',
    //         },
    //         {
    //             id: 'slot-6',
    //             day: 'friday',
    //             startHour: '09:00',
    //             endHour: '12:00',
    //             recurrence: 'weekly',
    //         },
    //         {
    //             id: 'slot-7',
    //             day: 'friday',
    //             startHour: '13:30',
    //             endHour: '15:30',
    //             recurrence: 'weekly',
    //         }
    //     ]));
    // }),
    // http.get('http://localhost:8080/api/v1/doctors/slots/:id', async ({params}) => {
    //     const {id} = params
    //     return HttpResponse.json(await resolveRequestMock({
    //         id,
    //         day: 'monday',
    //         startHour: '09:00',
    //         endHour: '12:00',
    //         recurrence: 'monthly',
    //         start: '2025-10-02',
    //         end: '2025-10-09',
    //         dayNumber: 2,
    //         medicalConcerns: [
    //             {
    //                 id: '00000000-0000-0000-0000-000000000001',
    //                 name: 'Consultation standard',
    //                 duration: 30,
    //             },
    //         ]
    //     }))
    // }),
]