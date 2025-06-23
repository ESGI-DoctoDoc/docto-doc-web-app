export interface UserAuth {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: 'admin' | 'doctor' | 'patient';
        phoneNumber: string;
        isEmailVerified: boolean;
        isDoubleAuthActive: boolean;
    },
    doctor?: {
        id: string;
        isVerified: boolean;
        isOnboardingCompleted: boolean;
        isLicenseActivated: boolean;
    } | null;
}