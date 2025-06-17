import {http, HttpResponse} from "msw";
import {rejectRequestMock, resolveRequestMock} from "~/mocks/handlers/utils.mock";
import type {MedicalConcern} from "~/types/medical-concern";
import type {MedicalConcernQuestion} from "~/types/medical-concern-question";

export const medicalConcernsMockHandlers = [
    http.get('http://localhost:8080/api/v1/doctors/medical-concerns', async () => {
        return HttpResponse.json(await resolveRequestMock([
            {
                id: '922fe9be-7319-4aee-aabb-9a78cc9f6591',
                name: 'Concern 1',
                duration: 30,
                price: 100,
                createdAt: new Date().toISOString(),
                questions: [
                    {
                        id: 'question1',
                        question: 'What is your name?',
                        type: 'text',
                        options: [],
                        isMandatory: true,
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: 'question2',
                        question: 'Do you have any allergies?',
                        type: 'yes_no',
                        options: [],
                        isMandatory: true,
                        createdAt: new Date().toISOString(),
                    }
                ],
            },
            {
                id: 'uuid2',
                name: 'Concern 2',
                duration: 45,
                price: 150,
                createdAt: new Date().toISOString(),
                questions: [
                    {
                        id: 'question3',
                        question: 'Select your symptoms',
                        type: 'list',
                        options: [
                            {label: 'Fever', value: 'fever'},
                            {label: 'Cough', value: 'cough'},
                            {label: 'Headache', value: 'headache'},
                        ],
                        isMandatory: false,
                        createdAt: new Date().toISOString(),
                    }
                ],
            },
        ] satisfies MedicalConcern[]))
    }),
    http.delete('http://localhost:8080/api/v1/doctors/medical-concerns/:id', async ({params}) => {
        const {id} = params
        if (id === '922fe9be-7319-4aee-aabb-9a78cc9f6591') return HttpResponse.json(await rejectRequestMock())
        return HttpResponse.json(await resolveRequestMock({
                message: `Medical concern with id ${id} deleted successfully`
            }
        ))
    }),
    http.get('http://localhost:8080/api/v1/doctors/medical-concerns/922fe9be-7319-4aee-aabb-9a78cc9f6591/questions', async () => {
        return HttpResponse.json(await resolveRequestMock([
            {
                id: 'question1',
                question: 'What is your name?',
                type: 'text',
                options: [],
                isMandatory: true,
                createdAt: new Date().toISOString(),
            },
            {
                id: 'question2',
                question: 'Do you have any allergies?',
                type: 'yes_no',
                options: [],
                isMandatory: true,
                createdAt: new Date().toISOString(),
            },
            {
                id: 'question3',
                question: 'Select your symptoms',
                type: 'list',
                options: [
                    {label: 'Fever', value: 'fever'},
                    {label: 'Cough', value: 'cough'},
                    {label: 'Headache', value: 'headache'},
                ],
                isMandatory: false,
                createdAt: new Date().toISOString(),
            },
            {
                id: 'question4',
                question: 'Select your preferred treatment',
                type: 'list',
                options: [
                    {label: 'Medication', value: 'medication'},
                    {label: 'Therapy', value: 'therapy'},
                    {label: 'Surgery', value: 'surgery'},
                ],
                isMandatory: false,
                createdAt: new Date().toISOString(),
            }
        ] satisfies MedicalConcernQuestion[]));
    })
]