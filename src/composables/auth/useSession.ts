import type {UserAuth} from "~/types/auth";

export class LocalStorageService {
    private readonly TokenKey = 'token';
    private readonly DoubleAuthKey = 'isDoubleAuthActive';
    private readonly UserKey = 'user';

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
            TokenKey: this.TokenKey,
            DoubleAuthKey: this.DoubleAuthKey,
            UserKey: this.UserKey,
        };
    }
}

export const useSession = () => {
    const setToken = (token: string) => {
        const localStorageService = new LocalStorageService();
        localStorageService.setItem(localStorageService.keys.TokenKey, token);
    }
    const setDoubleAuth = (isDoubleAuthActive: boolean) => {
        const localStorageService = new LocalStorageService();
        localStorageService.setItem(localStorageService.keys.DoubleAuthKey, isDoubleAuthActive.toString());
    }
    const setUserFromAuth = (user: UserAuth) => {
        const localStorageService = new LocalStorageService();
        localStorageService.setItem(localStorageService.keys.UserKey, JSON.stringify(user));
    }

    const getToken = () => {
        const localStorageService = new LocalStorageService();
        return localStorageService.getItem(localStorageService.keys.TokenKey);
    }
    const getUser = (): UserAuth | null => {
        const localStorageService = new LocalStorageService();
        const user = localStorageService.getItem(localStorageService.keys.UserKey);
        return user ? JSON.parse(user) : null;
    }

    const hasDoubleAuth = computed(() => {
        const localStorageService = new LocalStorageService();
        const doubleAuth = localStorageService.getItem(localStorageService.keys.DoubleAuthKey);
        return doubleAuth === 'true';
    })
    const hasLicenseActive = computed(() => {
        const user = getUser();
        return user?.doctor?.isLicenseActivated ?? false;
    })

    const logoutUser = () => {
        console.log('[Session] Logging out user...');
        const localStorageService = new LocalStorageService();
        localStorageService.removeItem(localStorageService.keys.UserKey);
        localStorageService.removeItem(localStorageService.keys.TokenKey);
        localStorageService.removeItem(localStorageService.keys.DoubleAuthKey);
        localStorageService.removeItem('dismissLicenseBanner');
        navigateTo('/auth/login');
    }

    return {
        setToken,
        setDoubleAuth,
        setUserFromAuth,

        getToken,
        getUser,

        hasDoubleAuth,
        hasLicenseActive,

        logoutUser,
    }
}