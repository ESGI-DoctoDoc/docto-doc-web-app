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