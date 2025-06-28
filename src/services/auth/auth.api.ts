import {RequestBuilder} from "~/api/request-builder";
import {
    type LoginBody,
    loginBodySchema,
    type LoginDto,
    type LoginResponse,
    loginResponseSchema
} from "~/services/auth/dto/login.dto";
import {type RegisterBody, registerBodySchema, type RegisterDto,} from "~/services/auth/dto/register.dto";
import {
    type OtpBody,
    otpBodySchema,
    type OtpDto,
    type OtpResponse,
    otpResponseSchema
} from "~/services/auth/dto/otp.dto";
import {type GetDoctorMeResponse, getDoctorMeSchema} from "~/services/auth/dto/get-me.dto";
import {type VerifyEmailBody, verifyEmailBodySchema} from "~/services/auth/dto/verify-email.dto";

export const useAuthApi = () => {
    const AUTH_API_URL = `${import.meta.env.VITE_API_BASE}/v1`
    const isLoading = ref(false)

    const getDoctorMe = async () => {
        isLoading.value = true
        return new RequestBuilder(AUTH_API_URL)
            .get('/doctors/auth/me')
            .withResponse<GetDoctorMeResponse>(getDoctorMeSchema)
            .execute()
            .finally(() => (isLoading.value = false))
    }

    const login = async (loginDto: LoginDto) => {
        isLoading.value = true
        return new RequestBuilder(AUTH_API_URL)
            .post('/doctors/login')
            .withBody<LoginBody>(loginBodySchema)
            .withResponse<LoginResponse>(loginResponseSchema)
            .execute({
                body: {
                    identifier: loginDto.email,
                    password: loginDto.password,
                    verificationUrl: `${origin}/auth/verify`,
                }
            })
            .finally(() => (isLoading.value = false))
    }

    const register = async (registerDto: RegisterDto) => {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        isLoading.value = true
        return new RequestBuilder(AUTH_API_URL)
            .post('/doctors/register')
            .withBody<RegisterBody>(registerBodySchema)
            .execute({
                body: {
                    email: registerDto.email,
                    password: registerDto.password,
                    phoneNumber: registerDto.phoneNumber,
                    verificationUrl: `${origin}/auth/verify`,
                }
            })
            .finally(() => (isLoading.value = false))
    }

    const verifyEmail = async (userId: string) => {
        return new RequestBuilder(AUTH_API_URL)
            .post(`/users/validate-email`)
            .withBody<VerifyEmailBody>(verifyEmailBodySchema)
            .execute({
                body: {
                    userId: userId,
                }
            })
    }

    const verifyOtp = async (otpDto: OtpDto) => {
        isLoading.value = true
        return new RequestBuilder(AUTH_API_URL)
            .post('/doctors/validate-double-auth')
            .withBody<OtpBody>(otpBodySchema)
            .withResponse<OtpResponse>(otpResponseSchema)
            .execute({
                body : {
                    doubleAuthCode: otpDto.doubleAuthCode,
                }
            })
            .finally(() => (isLoading.value = false))
    }

    return {
        isLoading,
        login,
        register,
        verifyEmail,
        verifyOtp,
        getDoctorMe,
    }
}