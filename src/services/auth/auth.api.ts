import {RequestBuilder} from "~/api/request-builder";
import {
    type LoginBody,
    loginBodySchema,
    type LoginDto,
    type LoginResponse,
    loginResponseSchema
} from "~/services/auth/dto/login.dto";

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

    const register = async () => {
        //todo abd:
    }

    const verifyOtp = async () => {
        //todo abd:
    }

    return {
        isLoading,
        login,
        register,
        verifyOtp,
    }
}