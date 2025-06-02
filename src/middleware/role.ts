import {useSession} from "~/composables/auth/useSession";

export default defineNuxtRouteMiddleware((to) => {
    const {getUser} = useSession();

    const user = getUser()
    const role = to.meta.roles as 'admin' | 'doctor' | undefined

    if (!user || !role || user.role !== role) {
        return navigateTo('/my-calendar')
    }
})