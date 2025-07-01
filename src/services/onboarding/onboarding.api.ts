import {RequestBuilder} from "~/api/request-builder";
import {
    type OnboardingBody,
    onboardingBodySchema,
    type OnboardingDto,
    type OnboardingResponse,
    onboardingResponseSchema,
} from "~/services/onboarding/dto/onboarding.dto";

export const useOnboardingApi = () => {
    const AUTH_API_URL = `${import.meta.env.VITE_API_BASE}/v1`
    const isLoading = ref(false)

    const process = async (onboardingDto: OnboardingDto) => {
        isLoading.value = true
        return new RequestBuilder(AUTH_API_URL)
            .post('/doctors/onboarding')
            .withBody<OnboardingBody>(onboardingBodySchema)
            .withResponse<OnboardingResponse>(onboardingResponseSchema)
            .execute({
                body: {
                    rpps: onboardingDto.rpps,
                    speciality: onboardingDto.speciality,
                    experienceYears: onboardingDto.experienceYears,
                    acceptPublicCoverage: onboardingDto.acceptPublicCoverage,
                    firstName: onboardingDto.firstName,
                    lastName: onboardingDto.lastName,
                    gender: onboardingDto.gender,
                    birthDate: onboardingDto.birthDate,
                    bio: onboardingDto.bio,
                    pictureDocumentId: onboardingDto.profilePictureUrl,
                    languages: onboardingDto.languages,
                    doctorDocuments: onboardingDto.doctorDocuments
                }
            })
            .finally(() => (isLoading.value = false));
    }

    return {
        isLoading,
        process,
    }
}