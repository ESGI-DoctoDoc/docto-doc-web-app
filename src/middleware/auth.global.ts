import {useSession} from '~/composables/auth/useSession'
import {useAuthApi} from "~/services/auth/auth.api";
import type {UserAuth} from "~/types/auth";

export default defineNuxtRouteMiddleware(async (to) => {
    const {
        getToken,
        hasDoubleAuth,
        setUserFromAuth,
        logoutUser,
    } = useSession()
    const {getDoctorMe} = useAuthApi()

    const publicPages = [
        '/auth/login',
        '/auth/register',
        '/auth/forgotPassword',
        '/auth/verify',
    ]

    const otpPage = '/otp'
    const onboardingPage = '/onboarding'
    const loginPage = '/auth/login'

    const isPublicPage = publicPages.includes(to.path)
    const isOtpPage = to.fullPath === otpPage
    const isOnboardingPage = to.fullPath === onboardingPage

    // check if the user has a token
    if (!getToken()) {
        if (!isPublicPage) {
            return navigateTo(loginPage)
        }
        return
    }

    // check if the user has double auth
    if (!hasDoubleAuth.value) {
        if (!isOtpPage) {
            return navigateTo(otpPage)
        }
        return
    }

    // now we can fetch the user data
    try {
        const currentUser = await getDoctorMe() as UserAuth;

        // set the user data
        setUserFromAuth(currentUser);

        // check if the user is admin
        if (currentUser.user.role === 'admin') {
            if (isPublicPage) return navigateTo('/')
            return
        }

        // check if the user has verified their email
        if (!currentUser.user?.isEmailVerified) {
            logoutUser();
            return
        }

        // check if the user has set up double authentication
        if (!currentUser.user?.isDoubleAuthActive) {
            if (!isOtpPage) {
                return navigateTo(otpPage)
            }
            return
        }

        //doctor check
        if (currentUser?.doctor) {
            // check if the doctor has completed onboarding
            if (!currentUser.doctor?.isOnboardingCompleted) {
                if (!isOnboardingPage) {
                    return navigateTo(onboardingPage)
                }
                return
            }

            //check if the user is verified by the admin
            if (!currentUser.doctor?.isVerified) {
                if (!isOnboardingPage) {
                    return navigateTo(onboardingPage)
                }
                return
            }
        }

        // check if the user can go to the private pages
        if (to.fullPath.startsWith('/admin')) {
            return navigateTo('/')
        }

        // doctor can now access the app
    } catch (error) {
        // assume the user is not authenticated
        console.error(error)
        logoutUser();
    }
})