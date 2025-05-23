import {useSession} from '~/composables/auth/useSession'

export default defineNuxtRouteMiddleware((to) => {
    const {
        isAuthenticated,
        hasOtpValidated,
        hasCompletedOnboarding
    } = useSession()

    const publicPages = [
        '/auth/login',
        '/auth/register',
        '/auth/forgotPassword',
        '/auth/email-verified',
    ]

    const otpPage = '/otp'
    const onboardingPage = '/onboarding'

    const isPublicPage = publicPages.includes(to.fullPath)
    const isOtpPage = to.fullPath === otpPage
    const isOnboardingPage = to.fullPath === onboardingPage

    // 1. Pas connecté
    if (!isAuthenticated.value) {
        if (!isPublicPage) return navigateTo('/auth/login')
        return
    }

    // 2. Connecté, OTP non validé
    if (!hasOtpValidated.value) {
        if (!isOtpPage) return navigateTo(otpPage)
        return
    }

    // 3. OTP validé, onboarding non complété
    if (!hasCompletedOnboarding.value) {
        if (!isOnboardingPage) return navigateTo(onboardingPage)
        return
    }

    // 4. Utilisateur connecté mais sur une page publique → redirection vers l'accueil
    if (isPublicPage) return navigateTo('/')

    // 5. Accès admin restreint
    // if (to.fullPath.startsWith('/admin') && user.value?.role !== 'admin') {
    //     return navigateTo('/')
    // }

    // ✅ Accès autorisé
})