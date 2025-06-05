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
    http.get('http://localhost:8080/api/v1/medical-concerns', async () => {
        return HttpResponse.json(await resolveRequest([
            {
                id: '00000000-0000-0000-0000-000000000001',
                name: 'Consultation standard',
                duration: '30min',
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
                        type: 'YES_NO',
                        isMandatory: false,
                        createdAt: new Date().toISOString(),
                    }
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