"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { emailSchema, type EmailFormData } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Chrome, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import EmailSent from "./email-sent";

interface AuthFormProps {
  mode: "signin" | "signup";
  title: string;
  subtitle: string;
}

export function AuthForm({ mode, title, subtitle }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const searchParams = useSearchParams();

  // Get any error from URL params (from NextAuth redirects)
  const urlError = searchParams.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
  });

  // Handle email form submission
  const onEmailSubmit = async (data: EmailFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`📧 Attempting ${mode} with email:`, data.email);

      const result = await signIn("email", {
        email: data.email,
        redirect: false, // Handle redirect manually
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        console.error("❌ Email sign-in error:", result.error);
        setError(getAuthErrorMessage(result.error));
      } else {
        console.log("✅ Verification email sent successfully");
        setEmailSent(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      console.log("❌ Email submission error.");
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
        redirect: true, // Let NextAuth handle the redirect
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      console.log("❌ Google sign-in error.");
      setError("Google sign-in failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  if (emailSent) {
    return <EmailSent />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
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
          <div className="w-full border-t " />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2">Or continue with email</span>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-sm font-medium ">
            Email address
          </Label>
          <div className="mt-1 relative">
            <Input
              {...register("email")}
              type="email"
              autoComplete="off"
              placeholder="Enter your email address"
              className="pl-10"
              disabled={isLoading}
            />
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 " />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!isValid || isLoading || isGoogleLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Sending verification email...
            </>
          ) : (
            `Continue with email`
          )}
        </Button>
      </form>

      {/* Help text */}
      <div className="text-center">
        <p className="text-xs ">
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
            "We'll send you a secure link to sign in instantly"
          )}
        </p>
      </div>
    </div>
  );
}
