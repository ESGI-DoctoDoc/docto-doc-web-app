export interface UserAuth {
    user: {
        id: string;
        email: string;
        role: 'admin' | 'doctor' | 'patient';
        phoneNumber: string;
        isEmailVerified: boolean;
        isDoubleAuthActive: boolean;
    },
    doctor?: {
        id: string;
        firstName: string;
        lastName: string;
        isVerified: boolean;
        isOnboardingCompleted: boolean;
        isLicenseActivated: boolean;
        avatarUrl: string;
    } | null;
}