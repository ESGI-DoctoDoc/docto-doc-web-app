import {http, HttpResponse} from 'msw'

async function resolveRequest(data: unknown) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        success: true,
        data: data,
    }
}

async function rejectRequest(data: unknown): Promise<{ success: false, errorCode: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        success: false,
        errorCode: 'Error.test.errorCode',
    }
}

export const handlers = [
    // http.post('http://localhost:8080/api/v1/doctors/slots/monthly', async () => {
    //     return HttpResponse.json(await resolveRequest({
    //         id: 'uuid1234',
    //     }));
    // }),
    // http.post('http://localhost:8080/api/v1/doctors/slots/weekly', async () => {
    //     return HttpResponse.json(await resolveRequest({
    //         id: 'uuid1234',
    //     }));
    // }),
    // http.get('http://localhost:8080/api/v1/doctors/slots?start_dade=2025-06-10', async () => {
    //     return HttpResponse.json(await resolveRequest([
    //         {
    //             id: 'slot-1',
    //             day: 'monday',
    //             startHour: '09:00',
    //             endHour: '12:00',
    //             recurrence: 'weekly',
    //         },
    //         {
    //             id: 'slot-2',
    //             day: 'sunday',
    //             dayNumber: 15,
    //             startHour: '09:00',
    //             endHour: '12:00',
    //             recurrence: 'monthly',
    //         },
    //         {
    //             id: 'slot-3',
    //             day: 'friday',
    //             startHour: '15:00',
    //             endHour: '18:30',
    //             recurrence: 'weekly',
    //         },
    //     ]));
    // }),

    // http.get('http://localhost:8080/api/v1/doctors/slots/:id', async ({params}) => {
    //     const {id} = params
    //     return HttpResponse.json(await resolveRequest({
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

    // http.put('http://localhost:8080/api/v1/medical-concerns/:id/questions', async ({params, request}) => {
    //     return HttpResponse.json(await resolveRequest({}));
    // }),
    // http.post('http://localhost:8080/api/v1/medical-concerns', async ({request}) => {
    //     const body = await request.json() as {
    //         name: string,
    //         duration: '0h15' | '0h30' | '0h45' | '1h00' | '1h30' | '2h00',
    //         price: number,
    //     } | null
    //
    //     if (!body) {
    //         return HttpResponse.json(await rejectRequest({message: 'Invalid request body'}))
    //     }
    //
    //     return HttpResponse.json(await resolveRequest({
    //         id: 'uuid1234',
    //         ...body,
    //         createdAt: new Date().toISOString(),
    //     }))
    // }),
    http.get('http://localhost:8080/api/v1/doctors/medical-concerns', async () => {
        return HttpResponse.json(await resolveRequest([
            {
                id: '00000000-0000-0000-0000-000000000001',
                name: 'Consultation standard',
                duration: 30,
                price: 30,
                questions: [
                    {
                        id: 'q1',
                        question: 'Quels sont vos symptômes ?',
                        type: 'text',
                        isMandatory: true,
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: 'q2',
                        question: 'Avez-vous des antécédents médicaux ?',
                        type: 'yes_no',
                        isMandatory: false,
                        createdAt: new Date().toISOString(),
                    }
                ],
                createdAt: new Date().toISOString(),
            },
            {
                id: '00000000-0000-0000-0000-000000000002',
                name: 'Consultation',
                duration: 60,
                price: 30,
                questions: [
                    {
                        id: 'q1',
                        question: 'Quels sont vos symptômes ?',
                        type: 'text',
                        isMandatory: true,
                        createdAt: new Date().toISOString(),
                    },
                ],
                createdAt: new Date().toISOString(),
            },
        ]))
    }),
    http.post('http://localhost:8080/api/v1/specialities', async ({request}) => {
        const body = await request.json() as { name: string } | null
        return HttpResponse.json(await resolveRequest({
            id: 'uuid4',
            name: body?.name,
            createdAt: new Date().toISOString(),
        }))
    }),

    http.post('http://localhost:8080/api/login', async () => {
        return HttpResponse.json()
        // return HttpResponse.error();
    }),

    http.get('http://localhost:8080/api/v1/medical-concerns', async () => {
        return HttpResponse.json(await resolveRequest([
            {
                id: 'uuid1',
                name: 'Concern 1',
                description: 'Description for Concern 1',
            },
            {
                id: 'uuid2',
                name: 'Concern 2',
                description: 'Description for Concern 2',
            },
            {
                id: 'uuid3',
                name: 'Concern 3',
                description: 'Description for Concern 3',
            },
            {
                id: 'uuid4',
                name: 'Concern 4',
                description: 'Description for Concern 4',
            },
            {
                id: 'uuid5',
                name: 'Concern 5',
                description: 'Description for Concern 5',
            },
            {
                id: 'uuid6',
                name: 'Concern 6',
                description: 'Description for Concern 6',
            },
            {
                id: 'uuid7',
                name: 'Concern 7',
                description: 'Description for Concern 7',
            },
            {
                id: 'uuid8',
                name: 'Concern 8',
                description: 'Description for Concern 8',
            },
            {
                id: 'uuid9',
                name: 'Concern 9',
                description: 'Description for Concern 9',
            },
            {
                id: 'uuid10',
                name: 'Concern 10',
                description: 'Description for Concern 10',
            },
            {
                id: 'uuid11',
                name: 'Concern 11',
                description: 'Description for Concern 11',
            },
            {
                id: 'uuid12',
                name: 'Concern 12',
                description: 'Description for Concern 12',
            },
            {
                id: 'uuid13',
                name: 'Concern 13',
                description: 'Description for Concern 13',
            },
            {
                id: 'uuid14',
                name: 'Concern 14',
                description: 'Description for Concern 14',
            },
            {
                id: 'uuid15',
                name: 'Concern 15',
                description: 'Description for Concern 15',
            },
        ]))
    }),
    http.delete('http://localhost:8080/api/v1/medical-concerns/:id', async ({params}) => {
        const {id} = params
        if (id === 'uuid1') return HttpResponse.json(await rejectRequest({}))
        return HttpResponse.json(await resolveRequest({
                message: `Medical concern with id ${id} deleted successfully`
            }
        ))
    })
]