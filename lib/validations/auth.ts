import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email is too long")
    .toLowerCase()
    .trim(),
});

export const otpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  token: z
    .string()
    .min(6, "Verification code must be 6 characters")
    .max(6, "Verification code must be 6 characters")
    .regex(
      /^[A-Z0-9]{6}$/,
      "Verification code must contain only letters and numbers"
    )
    .transform((val) => val.toUpperCase()), // Always convert to uppercase
});

export const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  token: z.string().optional(),
  step: z.enum(["email", "verification"]).default("email"),
});

export type EmailFormData = z.infer<typeof emailSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type AuthFormData = z.infer<typeof authSchema>;

export const validateEmail = (email: string): boolean => {
  try {
    emailSchema.parse({ email });
    return true;
  } catch {
    return false;
  }
};

export const validateOtp = (token: string): boolean => {
  return token.length >= 6 && token.length <= 255;
};
