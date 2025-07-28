"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import {
  emailSchema,
  otpSchema,
  type EmailFormData,
  type OtpFormData,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Chrome, Mail, RefreshCw } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface AuthFormProps {
  mode: "signin" | "signup";
  title: string;
  subtitle: string;
}

type AuthStep = "email" | "otp";

export function AuthForm({ mode, title, subtitle }: AuthFormProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>("email");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendOTPCoolDown, setResendOTPCoolDown] = useState(0);

  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: "onSubmit",
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    mode: "onSubmit",
    defaultValues: { email: userEmail, token: "" },
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`📧 Sending OTP to: ${data.email}`);

      // Call our custom OTP API
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        console.log("❌ Failed to send OTP:", result.error);
        setError(result.error || "Failed to send verification code");
      } else {
        console.log("✅ OTP sent successfully");
        setUserEmail(data.email);
        otpForm.setValue("email", data.email);
        setCurrentStep("otp");
      }
    } catch (error) {
      console.log("❌ Email submission error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const onOtpSubmit = async (data: OtpFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`🔐 Verifying OTP: ${data.token} for: ${data.email}`);

      // Step 1: Verify the OTP
      const verifyResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          token: data.token,
        }),
      });

      const verifyResult = await verifyResponse.json();

      if (!verifyResponse.ok || verifyResult.error) {
        console.error("❌ OTP verification failed:", verifyResult.error);
        setError(verifyResult.error || "Invalid verification code");
        return;
      }

      console.log("✅ OTP verified successfully");

      // Step 2: Prepare NextAuth session
      const sessionResponse = await fetch("/api/auth/sign-in-with-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          userId: verifyResult.userId,
        }),
      });

      const sessionResult = await sessionResponse.json();

      if (!sessionResponse.ok || sessionResult.error) {
        console.error("❌ Session preparation failed:", sessionResult.error);
        setError("Sign-in failed. Please try again.");
        return;
      }

      console.log("✅ Session prepared, signing in with NextAuth");

      // Step 3: Sign in using NextAuth credentials provider
      const signInResult = await signIn("otp-sign-in", {
        email: data.email,
        tempToken: sessionResult.tempToken,
        callbackUrl: "/dashboard",
        redirect: true,
      });

      if (signInResult?.error) {
        console.error("❌ NextAuth sign-in failed:", signInResult.error);
        setError("Sign-in failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ OTP verification error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth sign-in
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);

      console.log(`🔐 Attempting ${mode} with Google`);

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
      setError("Google sign-in failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendOTPCoolDown(60);
      setError(null);

      console.log(`📧 Resending OTP to: ${userEmail}`);

      const result = await signIn("email", {
        email: userEmail,
        redirect: false,
      });

      if (result?.error) {
        setError(getAuthErrorMessage(result.error));
      } else {
        console.log("✅ OTP email resent successfully");
      }
    } catch (error) {
      console.error("❌ Resend error.");
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setError("Failed to resend OTP. Please try again.");
    }

    const timer = setInterval(() => {
      setResendOTPCoolDown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBackToEmail = () => {
    setCurrentStep("email");
    setError(null);
  };

  // STEP 1: Email Input
  if (currentStep === "email") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-sm">{subtitle}</p>
        </div>

        {/* Error display */}
        {(error || urlError) && (
          <div className="rounded border p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-sm text-red-700">
                {error || getAuthErrorMessage(urlError)}
              </p>
            </div>
          </div>
        )}

        {/* Google OAuth Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full bg-transparent"
        >
          {isGoogleLoading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <Chrome className="mr-2 h-4 w-4" />
          )}
          {mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 ">Or continue with email</span>
          </div>
        </div>

        {/* Email Form */}
        <form
          onSubmit={emailForm.handleSubmit(onEmailSubmit)}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>
            <div className="mt-1 relative">
              <Input
                {...emailForm.register("email")}
                type="email"
                autoComplete="off"
                placeholder="Enter your email address"
                className="pl-10"
                disabled={isLoading}
              />
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 " />
            </div>
            {emailForm.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={
              !emailForm.formState.isValid || isLoading || isGoogleLoading
            }
            className="w-full"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Sending verification code...
              </>
            ) : (
              `Send verification code`
            )}
          </Button>
        </form>

        {/* Help text */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {mode === "signup" ? (
              <>
                By signing up, you agree to our{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </>
            ) : (
              "We'll send you a verification code to sign in"
            )}
          </p>
        </div>
      </div>
    );
  }

  // STEP 2: OTP Verification
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold">Enter verification code</h1>
        <p className="mt-2 text-sm">
          We sent a verification code to <strong>{userEmail}</strong>
        </p>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded border p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* OTP Form */}
      <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="token" className="text-sm font-medium">
            Verification code
          </Label>
          <div className="mt-1">
            <Input
              {...otpForm.register("token")}
              type="text"
              placeholder="Enter 6-digit code"
              className={"text-center text-lg font-mono "}
              disabled={isLoading}
              autoComplete="one-time-code"
              maxLength={6}
            />
          </div>
          {otpForm.formState.errors.token && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {otpForm.formState.errors.token.message}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500 text-center">
            Check your email for the 6-digit verification code
          </p>
        </div>

        <Button
          type="submit"
          disabled={!otpForm.formState.isValid || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Verifying code...
            </>
          ) : (
            "Verify and sign in"
          )}
        </Button>
      </form>

      {/* Resend and back options */}
      <div className="space-y-3">
        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            onClick={handleResendOtp}
            disabled={resendOTPCoolDown > 0}
            className="text-sm"
          >
            {resendOTPCoolDown > 0 ? (
              `Resend code in ${resendOTPCoolDown}s`
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend verification code
              </>
            )}
          </Button>
        </div>

        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBackToEmail}
            className="text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Use a different email
          </Button>
        </div>
      </div>

      {/* Help text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Didn&apos;t receive the code? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );
}
