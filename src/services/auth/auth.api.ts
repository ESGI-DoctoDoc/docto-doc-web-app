import {ApiClient} from "~/api/api-client";
import {type LoginRequest, type LoginResponse, parseLoginResponse} from "~/services/auth/dto/login.dto";

export const useAuthApi = (apiClient = new ApiClient()) => {
    const config = useRuntimeConfig()
    const AUTH_API_URL = `${config.public.apiBase}/v1`
    const isLoading = ref(false)

    const login = async (loginDto: LoginRequest) => {
        isLoading.value = true
        return apiClient.post<LoginResponse, LoginRequest>(`${AUTH_API_URL}/doctors/login`, loginDto)
            .then((response) => parseLoginResponse(response))
            .finally(() => (isLoading.value = false))
    }

    // const register = async (registerDto: RegisterRequest) => {
    //     isLoading.value = true
    //     return apiClient.post<RegisterResponse, RegisterRequest>(`${AUTH_API_URL}/patients/register`, registerDto)
    //         .then((response) => parseRegisterResponse(response))
    //         .finally(() => (isLoading.value = false))
    // }

    const verifyOtp = async (otp: string[]) => {
        isLoading.value = true
        return apiClient.post(`${AUTH_API_URL}/doctors/validate-double-auth`, {
            doubleAuthCode: otp.join(''),
        })
            .then((response) => response)
            .finally(() => (isLoading.value = false))
    }

    return {
        isLoading,
        login,
        // register,
        verifyOtp,
    }
}