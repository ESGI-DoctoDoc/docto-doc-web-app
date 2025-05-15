import { http, HttpResponse } from 'msw'
import type {User} from "~/types/user";

export const handlers = [
    http.post('http://localhost:8000/api/login', async () => {
        return HttpResponse.json({
            id: 12,
            name: 'corentin lechene',
            email: 'c.lechene@doc.fr',
            role: "admin",
        } as User)
        // return HttpResponse.error();
    }),

    http.get('http://localhost:8000/api/users/me', () => {
        return HttpResponse.json({
            id: 12,
            name: 'corentin lechene',
            email: 'c.lechene@doc.fr',
            role: "admin",
        } as User)
    })
]