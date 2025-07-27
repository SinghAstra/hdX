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
  email: z.string().email(),
  token: z
    .string()
    .min(1, "Verification code is required")
    .max(255, "Verification code is too long")
    .trim(),
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
