import {RequestBuilder} from "~/api/request-builder";
import {
    type LoginBody,
    loginBodySchema,
    type LoginDto,
    type LoginResponse,
    loginResponseSchema
} from "~/services/auth/dto/login.dto";
import {
    type RegisterDto,
    type RegisterBody,
    registerBodySchema,
} from "~/services/auth/dto/register.dto";
import {
    type OtpDto,
    type OtpBody,
    otpBodySchema,
    type OtpResponse,
    otpResponseSchema
} from "~/services/auth/dto/otp.dto";
import {
    type RequestResetPasswordBody,
    type RequestResetPasswordDto,
    requestResetPasswordBodySchema
} from "~/services/auth/dto/requestResetPasswordDto";
import {
    type UpdatePasswordBody,
    type UpdatePasswordDto,
    updatePasswordBodySchema
} from "~/services/auth/dto/updatePasswordDto";

export const useAuthApi = () => {
    const config = useRuntimeConfig()
    const AUTH_API_URL = `${config.public.apiBase}/v1`
    const isLoading = ref(false)

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
                }
            })
            .finally(() => (isLoading.value = false))
    }

    const register = async (registerDto: RegisterDto) => {
        isLoading.value = true
        return new RequestBuilder(AUTH_API_URL)
            .post('/doctors/register')
            .withBody<RegisterBody>(registerBodySchema)
            .execute({
                body: {
                    email: registerDto.email,
                    password: registerDto.password,
                    phoneNumber: registerDto.phoneNumber,
                }
            })
            .finally(() => (isLoading.value = false))
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

    const requestResetPassword = async(requestResetPasswordDto: RequestResetPasswordDto) => {
        isLoading.value = true
        return new RequestBuilder(AUTH_API_URL)
            .post('/doctors/password-reset')
            .withBody<RequestResetPasswordBody>(requestResetPasswordBodySchema)
            .execute({
                body : {
                    email: requestResetPasswordDto.email,
                }
            })
            .finally(() => (isLoading.value = false))
    }

    const updatePassword = async(updatePasswordDto: UpdatePasswordDto) => {
        isLoading.value = true
        return new RequestBuilder(AUTH_API_URL)
            .put('/doctors/password-reset')
            .withBody<UpdatePasswordBody>(updatePasswordBodySchema)
            .execute({
                body : {
                    newPassword: updatePasswordDto.newPassword,
                    token: updatePasswordDto.token,
                }
            })
            .finally(() => (isLoading.value = false))
    }

    return {
        isLoading,
        login,
        register,
        verifyOtp,
        requestResetPassword,
        updatePassword,
    }
}