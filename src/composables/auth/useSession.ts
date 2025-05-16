class LocalStorageService {
    private readonly UserKey = 'user';
    private readonly TokenKey = 'token';
    private readonly OtpValidatedKey = 'otpValidated';
    private readonly OnboardingKey = 'hasCompletedOnboarding';

    setItem(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    getItem(key: string): string | null {
        return localStorage.getItem(key);
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
    }

    get keys() {
        return {
            UserKey: this.UserKey,
            TokenKey: this.TokenKey,
            OtpValidatedKey: this.OtpValidatedKey,
            OnboardingKey: this.OnboardingKey,
        };
    }
}

export const useSession = () => {
    const setToken = (token: string) => {
        const localStorageService = new LocalStorageService();
        localStorageService.setItem(localStorageService.keys.TokenKey, token);
    }

    const setHasOtpValidated = (hasOtpValidated: boolean) => {
        const localStorageService = new LocalStorageService();
        localStorageService.setItem(localStorageService.keys.OtpValidatedKey, hasOtpValidated.toString());
    }

    const setHasCompletedOnboarding = (hasCompletedOnboarding: boolean) => {
        const localStorageService = new LocalStorageService();
        localStorageService.setItem(localStorageService.keys.OnboardingKey, hasCompletedOnboarding.toString());
    }

    const getToken = () => {
        const localStorageService = new LocalStorageService();
        return localStorageService.getItem(localStorageService.keys.TokenKey);
    }

    const hasOtpValidated = computed(() => {
        const localStorageService = new LocalStorageService();
        const otpValidated = localStorageService.getItem(localStorageService.keys.OtpValidatedKey);
        return otpValidated === 'true';
    })

    const hasCompletedOnboarding = computed(() => {
        const localStorageService = new LocalStorageService();
        const onboardingCompleted = localStorageService.getItem(localStorageService.keys.OnboardingKey);
        return onboardingCompleted === 'true';
    })

    const isAuthenticated = computed(() => {
        const localStorageService = new LocalStorageService();
        const token = localStorageService.getItem(localStorageService.keys.TokenKey);
        return token !== null;
    })

    const logoutUser = () => {
        const localStorageService = new LocalStorageService();
        localStorageService.removeItem(localStorageService.keys.UserKey);
        localStorageService.removeItem(localStorageService.keys.TokenKey);
        localStorageService.removeItem(localStorageService.keys.OtpValidatedKey);
        localStorageService.removeItem(localStorageService.keys.OnboardingKey);
    }

    return {
        setToken,
        setHasOtpValidated,
        setHasCompletedOnboarding,
        hasOtpValidated,
        hasCompletedOnboarding,
        isAuthenticated,
        getToken,
        logoutUser
    }
}