import * as yup from "yup";

export const signUpSchema = yup.object({
  name: yup.string().required("Name is required"),
  dob: yup
    .date()
    .required("Date of Birth is required")
    .typeError("Date of Birth is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be 6 digits"),
});

export type SignUpFormData = {
  name: string;
  dob: Date | undefined;
  email: string;
  otp: string;
};
