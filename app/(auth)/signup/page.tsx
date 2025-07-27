import { AuthForm } from "@/components/auth/auth-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your Notes App account to start organizing your thoughts and ideas.",
};

export default function SignUpPage() {
  return (
    <AuthLayout>
      <AuthForm
        mode="signup"
        title="Create your account"
        subtitle="Start organizing your thoughts and ideas today"
      />

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in instead
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
