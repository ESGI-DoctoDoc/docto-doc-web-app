import {http, HttpResponse} from "msw";
import {resolveRequestMock} from "~/mocks/handlers/utils.mock";

export const doctorsMockHandlers = [
    http.get('http://localhost:8080/api/v1/admin/doctors/:doctorId/reporting', async () => {
        return HttpResponse.json(await resolveRequestMock([
            {
                id: 'report1',
                reporter: {
                    id: 'user123',
                    firstName: 'Alice',
                    lastName: 'Durand',
                    email: 'alice.durand@example.com',
                },
                explanation: 'Le numéro RPPS semble incorrect.',
                status: 'pending',
                createdAt: '2024-12-01T10:00:00Z',
            },
            {
                id: 'report2',
                reporter: {
                    id: 'user456',
                    firstName: 'Marc',
                    lastName: 'Lemoine',
                    email: 'marc.lemoine@example.com',
                },
                explanation: 'Informations de contact obsolètes.',
                status: 'resolved',
                createdAt: '2024-11-15T14:30:00Z',
            },
        ]));
    }),
    http.get('http://localhost:8080/api/v1/doctors/:doctorId/medical-concerns', async () => {
        return HttpResponse.json(await resolveRequestMock([
            {
                id: 'concern1',
                name: 'Consultation générale',
                duration: 30,
                price: 50,
                createdAt: '2025-01-01T09:00:00Z',
                questions: [
                    {
                        id: 'q1',
                        question: 'Avez-vous de la fièvre ?',
                        type: 'yes_no',
                        isMandatory: true,
                        createdAt: '2025-01-01T09:00:00Z'
                    },
                    {
                        id: 'q2',
                        question: 'Depuis combien de temps avez-vous ces symptômes ?',
                        type: 'text',
                        isMandatory: true,
                        createdAt: '2025-01-01T09:00:00Z'
                    }
                ]
            },
            {
                id: 'concern2',
                name: 'Consultation pédiatrique',
                duration: 45,
                price: 60,
                createdAt: '2025-01-02T09:00:00Z',
                questions: [
                    {
                        id: 'q3',
                        question: 'L’enfant a-t-il des allergies connues ?',
                        type: 'yes_no',
                        isMandatory: false,
                        createdAt: '2025-01-02T09:00:00Z'
                    },
                    {
                        id: 'q4',
                        question: 'Quels sont ses antécédents médicaux ?',
                        type: 'text',
                        isMandatory: false,
                        createdAt: '2025-01-02T09:00:00Z'
                    }
                ]
            },
            {
                id: 'concern3',
                name: 'Consultation dermatologique',
                duration: 30,
                price: 70,
                createdAt: '2025-01-03T09:00:00Z',
                questions: [
                    {
                        id: 'q5',
                        question: 'Quel type d’éruption cutanée avez-vous ?',
                        type: 'list',
                        isMandatory: true,
                        createdAt: '2025-01-03T09:00:00Z',
                        options: [
                            {label: 'Rougeurs', value: 'rougeurs'},
                            {label: 'Plaques sèches', value: 'plaques_seches'},
                            {label: 'Boutons', value: 'boutons'}
                        ]
                    },
                    {
                        id: 'q6',
                        question: 'Depuis quand ?',
                        type: 'text',
                        isMandatory: true,
                        createdAt: '2025-01-03T09:00:00Z'
                    }
                ]
            },
            {
                id: 'concern4',
                name: 'Suivi grossesse',
                duration: 60,
                price: 90,
                createdAt: '2025-01-04T09:00:00Z',
                questions: [
                    {
                        id: 'q7',
                        question: 'Quel est le terme actuel de la grossesse ?',
                        type: 'text',
                        isMandatory: true,
                        createdAt: '2025-01-04T09:00:00Z'
                    },
                    {
                        id: 'q8',
                        question: 'Complications précédentes ?',
                        type: 'yes_no',
                        isMandatory: false,
                        createdAt: '2025-01-04T09:00:00Z'
                    }
                ]
            },
            {
                id: 'concern5',
                name: 'Consultation ORL',
                duration: 25,
                price: 55,
                createdAt: '2025-01-05T09:00:00Z',
                questions: [
                    {
                        id: 'q9',
                        question: 'Avez-vous des douleurs à l’oreille ?',
                        type: 'yes_no',
                        isMandatory: true,
                        createdAt: '2025-01-05T09:00:00Z'
                    },
                    {
                        id: 'q10',
                        question: 'Depuis combien de temps ?',
                        type: 'text',
                        isMandatory: false,
                        createdAt: '2025-01-05T09:00:00Z'
                    }
                ]
            }
        ]));
    }),
]