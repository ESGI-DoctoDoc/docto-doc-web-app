import {http, HttpResponse} from "msw";
import {rejectRequestMock, resolveRequestMock} from "~/mocks/handlers/utils.mock";
import type {GetDoctorMeResponse} from "~/services/auth/dto/get-me.dto";

export const authMockHandlers = [
    http.post('http://localhost:8080/api/login', async () => {
        return HttpResponse.json(resolveRequestMock({}));
    }),
    http.get('http://localhost:8080/api/v1/doctors/auth/me', async () => {
        return HttpResponse.json(await resolveRequestMock({
            // user: {
            //     id: 'user-id',
            //     email: 'c.lechene@myges.fr',
            //     phoneNumber: '+33612345678',
            //     isEmailVerified: true,
            //     isDoubleAuthActive: true,
            //     role: 'admin'
            // },

            /* doctor connexion */
            user: {
                id: 'user-id',
                email: 'c.lechene@myges.fr',
                phoneNumber: '+33612345678',
                isEmailVerified: true,
                isDoubleAuthActive: true,
                role: 'doctor'
            },
            doctor: {
                id: 'doctor-id',
                firstName: 'Cyril',
                lastName: 'Lechene',
                isVerified: false,
                isOnboardingCompleted: false,
                isLicenseActivated: false,
            }
        } satisfies GetDoctorMeResponse))
    }),
    http.post('http://localhost:8080/api/v1/users/validate-email', async ({request}) => {
        const {userId} = (await request.json() || {}) as { userId: string };
        if (userId === 'error') {
            return HttpResponse.json(await rejectRequestMock());
        } else {
            return HttpResponse.json(await resolveRequestMock({}));
        }
    }),
]