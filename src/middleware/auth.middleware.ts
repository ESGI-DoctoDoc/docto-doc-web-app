import {useSession} from '~/composables/auth/useSession'

export default defineNuxtRouteMiddleware((to, from) => {
    const {isAuthenticated, user} = useSession()

    console.debug('[Auth Middleware] Route target:', to.fullPath)
    console.debug('[Auth Middleware] Route from:', from.fullPath)
    console.debug('[Auth Middleware] Authenticated:', isAuthenticated.value)
    console.debug('[Auth Middleware] User:', user.value)

    const authPages = ['/auth/login', '/auth/register']
    const privatePages = ['/admin']

    if(!isAuthenticated.value && !authPages.includes(to.fullPath)) {
        console.debug('[Auth Middleware] Redirecting to login page')
        return navigateTo('/auth/login')
    }

    if(isAuthenticated.value && authPages.includes(to.fullPath)) {
        console.debug('[Auth Middleware] Redirecting to home page')
        return navigateTo('/')
    }

    if(isAuthenticated.value && privatePages.includes(to.fullPath) && user.value?.role !== 'admin') {
        console.debug('[Auth Middleware] Redirecting to home page')
        return navigateTo('/')
    }
})