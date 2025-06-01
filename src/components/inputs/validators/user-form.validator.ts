import {z} from "zod";

export const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "form.email.required")
    .email("form.email.invalid");

export const passwordSchema = z
    .string()
    .trim()
    .min(6, "form.password.min")
    .regex(/[A-Z]/, "form.password.uppercase")
    .regex(/[0-9]/, "form.password.number")
    .regex(/[@\-_#$]/, "form.password.special");

export const otpCodeSchema = z
    .array(z.string())
    .length(6, "form.otp-code.invalid")

export const phoneSchema = z
    .string()
    .trim()
    .min(1, "form.phone.required")
    .regex(/^(0[67])([-. ]?[0-9]{2}){4}$/, "form.phone.invalid");

export const nameSchema = z
    .string()
    .trim()
    .min(3, "form.firstname.required")
    .max(50, "form.firstname.invalid")
    .regex(/^[a-zA-ZÀ-ÿ '-]+$/, "form.firstname.invalid");


const genderEnumSchema = z.enum(["MALE", "FEMALE"]);

export const bioSchema = z
    .string()
    .trim()
    .min(1, "form.bio.required")
    .max(200, "form.bio.invalid")

export const avatarSchema = z
    .string()
    .trim()
    .url();

export const rppsSchema = z
    .string()
    .trim()
    .min(1, "form.rpps.required")
    .regex(/^[0-9]{11}$/, "form.rpps.invalid");

export const specialitySchema = z
    .string()
    .trim()
    .min(1, "form.speciality.required")
    .regex(/^[a-zA-ZÀ-ÿ '-]+$/, "form.speciality.invalid");

export const medicalConcernsSchema = z
    .string()
    .trim()
    .min(1, "form.medical-concerns.required")
    .regex(/^[a-zA-ZÀ-ÿ '-]+$/, "form.medical-concerns.invalid");

export const experienceYearsSchema = z
    .number({ required_error: "form.experience-years.required" })

export const acceptPublicCoverageSchema = z
    .boolean({ required_error: "form.accept-public-coverage.required" });

export const birthDateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "form.birth-date.invalid") // yyyy-MM-dd

export const languagesSchema = z
    .array(z.string())
    .nonempty("form.languages.required");

export const doctorDocumentsSchema = z
    .array(z.string().url())
    .nonempty("form.doctor-documents.required");

/* forms */
export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});
export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    phone: phoneSchema,
});
export type RegisterForm = z.infer<typeof registerSchema>;

export const otpVerificationSchema = z.object({
    code: otpCodeSchema,
})
export type OtpVerificationForm = z.infer<typeof otpVerificationSchema>;

export const forgotPasswordSchema = z.object({
    email: emailSchema,
})
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    password: passwordSchema,
    passwordConfirm: passwordSchema,
})
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const profileSchema = z.object({
    firstname: nameSchema,
    lastname: nameSchema,
    bio: bioSchema,
    avatar: avatarSchema,
})
export type ProfileForm = z.infer<typeof profileSchema>;

export const onboardingSchema = z.object({
    rpps: rppsSchema,
    speciality: specialitySchema,
    gender: genderEnumSchema,
    experienceYears: experienceYearsSchema,
    acceptPublicCoverage: acceptPublicCoverageSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    bio: bioSchema,
    birthDate: birthDateSchema,
    profilePictureUrl: avatarSchema,
    languages: languagesSchema,
    doctorDocuments: doctorDocumentsSchema
})

export type OnboardingForm = z.infer<typeof onboardingSchema>;