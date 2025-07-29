"use client";

import { useToastContext } from "@/components/providers/toast";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { SignUpFormData, signUpSchema } from "@/lib/validations/auth";
import { Eye, EyeOff, Loader } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import * as yup from "yup";

function SignUpClientPage() {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    dob: undefined,
    email: "",
    otp: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormData, string>>
  >({});
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const { setToastMessage } = useToastContext();
  const [isGoogleSigningUp, setIsGoogleSigningUp] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear error for this field when user starts editing
    if (errors[id as keyof SignUpFormData]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, dob: date }));

    // Clear error for dob field when user starts editing
    if (errors.dob) {
      setErrors((prev) => ({ ...prev, dob: undefined }));
    }
  };

  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("handleSendOTP Called.");
    e.preventDefault();
    try {
      await yup
        .object()
        .shape({
          email: signUpSchema.fields.email,
        })
        .validate(
          {
            email: formData.email,
          },
          { abortEarly: false }
        );
      setIsSendingOTP(true);
      setErrors({});
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        console.log("❌ Failed to send OTP:", data.message);
        throw new Error(data.message || "Failed to send verification code");
      }

      setToastMessage("Please check your email for the OTP.");
      setIsOTPSent(true);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        console.log("Inside yup Validation Error");
        console.log("error.inner is ", error.inner);
        const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};
        error.inner.forEach((err) => {
          console.log("err.path is ", err.path);
          if (err.path) {
            newErrors[err.path as keyof SignUpFormData] = err.message;
          }
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
        setToastMessage(error.message);
      }
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleSignUpWithOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signUpSchema.validate(formData, { abortEarly: false });

      setIsSigningUp(true);
      setErrors({});
      console.log("Attempting to sign up with OTP:", formData);

      // Step 1: Verify the OTP
      const verifyOTPResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          name: formData.name,
          dob: formData.dob,
        }),
      });

      const verifyOTPData = await verifyOTPResponse.json();

      if (!verifyOTPResponse.ok) {
        console.log("❌ OTP verification failed:", verifyOTPData.message);
        setToastMessage(verifyOTPData.message || "Invalid verification code");
        return;
      }

      console.log("✅ OTP verified successfully");

      // Step 2: Prepare NextAuth session
      const generateSessionResponse = await fetch(
        "/api/auth/sign-in-with-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            userId: verifyOTPData.userId,
          }),
        }
      );

      const generateSessionData = await generateSessionResponse.json();

      if (!generateSessionResponse.ok) {
        console.log(
          "❌ Session preparation failed:",
          generateSessionData.message
        );
        setToastMessage(
          generateSessionData.message || "Sign-in failed. Please try again."
        );
        return;
      }

      console.log("✅ Session prepared, signing in with NextAuth");

      // Step 3: Sign in using NextAuth credentials provider
      const signInResult = await signIn("otp-sign-in", {
        email: formData.email,
        tempToken: generateSessionData.tempToken,
        callbackUrl: "/dashboard",
        redirect: true,
      });

      if (signInResult?.error) {
        console.error("❌ NextAuth sign-in failed:", signInResult.error);
        setToastMessage("Sign-in failed. Please try again.");
      }

      setToastMessage("Sign up successful! Redirecting...");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        console.log("Inside yup Validation Error");
        console.log("error.inner is ", error.inner);
        const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};
        error.inner.forEach((err) => {
          console.log("err.path is ", err.path);
          if (err.path) {
            newErrors[err.path as keyof SignUpFormData] = err.message;
          }
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
        setToastMessage(error.message);
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleSigningUp(true);
      setErrors({});

      await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (error) {
      console.log("❌ Google sign-in error.");
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setToastMessage("Google sign-in failed. Please try again.");
      setIsGoogleSigningUp(false);
    }
  };

  return (
    <div className="w-full flex min-h-screen p-4">
      <div className="p-8 space-y-6 flex-1 flex flex-col items-center justify-center relative">
        <Link href="/">
          <div className="flex items-center space-x-2 mb-16 md:mb-0 md:absolute md:top-0 md:left-0">
            <Loader className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">
              {siteConfig.name}
            </span>
          </div>
        </Link>

        <div className="max-w-xl w-full space-y-6 flex flex-col ">
          <div className="space-y-2 w-full">
            <h1 className="text-3xl font-bold text-foreground">Sign up</h1>
            <p className="text-muted-foreground">
              Sign up to enjoy the feature of {siteConfig.name}
            </p>
          </div>

          <form
            onSubmit={isOTPSent ? handleSignUpWithOTP : handleSendOTP}
            className="space-y-4 w-full"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Jonas Khanwald"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-destructive" : ""}
                autoComplete="off"
              />
              {errors.name && (
                <p className="text-sm text-destructive text-right">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <DatePicker
                selectedDate={formData.dob}
                onDateChange={handleDateChange}
                error={errors.dob}
              />
              {errors.dob && (
                <p className="text-sm text-destructive text-right">
                  {errors.dob}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jonas_kahnwald@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-destructive" : ""}
                autoComplete="off"
              />
              {errors.email && (
                <p className="text-sm text-destructive text-right">
                  {errors.email}
                </p>
              )}
            </div>

            {isOTPSent ? (
              <>
                <div className="space-y-2 mt-4">
                  <div className="relative">
                    <Input
                      id="otp"
                      placeholder="OTP"
                      value={formData.otp}
                      onChange={handleChange}
                      className={
                        errors.otp ? "border-destructive pr-10" : "pr-10"
                      }
                      autoComplete="off"
                      type={showOtp ? "text" : "password"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowOtp((prev) => !prev)}
                    >
                      {showOtp ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showOtp ? "Hide OTP" : "Show OTP"}
                      </span>
                    </Button>
                  </div>
                  {errors.otp && (
                    <p className="text-sm text-destructive text-right">
                      {errors.otp}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isSigningUp}>
                  {isSigningUp ? (
                    <div className="flex items-center gap-2">
                      <Loader className="w-3 h-3 animate-spin" /> Signing Up...
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </>
            ) : (
              <Button type="submit" className="w-full" disabled={isSendingOTP}>
                {isSendingOTP ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-3 h-3 animate-spin" /> Wait...
                  </div>
                ) : (
                  "Get OTP"
                )}
              </Button>
            )}
          </form>

          <Button
            className="w-full rounded tracking-wide relative"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSigningUp}
          >
            {isGoogleSigningUp ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Wait ...
              </>
            ) : (
              <>
                <Image
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  width={18}
                  height={18}
                  className="mr-2"
                />
                <span className="text-center tracking-wide">
                  Continue with Google
                </span>
              </>
            )}
          </Button>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline text-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden md:flex relative flex-1">
        <Image
          src="/assets/bg-auth.jpg"
          alt="Abstract blue waves"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover rounded-r-xl"
          priority
        />
      </div>
    </div>
  );
}

export default SignUpClientPage;
