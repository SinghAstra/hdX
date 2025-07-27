import { Button } from "@/components/ui/button";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

interface Props {
  searchParams: { error: string };
}

export default function AuthErrorPage({ searchParams }: Props) {
  const error = searchParams.error;
  const errorMessage = getAuthErrorMessage(error);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold ">Authentication Error</h1>
          <p className="mt-2 ">We encountered a problem signing you in.</p>
        </div>

        <div className="rounded-lg border p-6 shadow-sm">
          <div className="rounded p-4 mb-6 text-red-700">
            <h3 className="font-medium">What happened?</h3>
            <p className="mt-1 text-sm">{errorMessage}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/login">
              <Button className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try signing in again
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="w-full bg-transparent">
                Create a new account
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm ">
            Still having trouble?{" "}
            <Link href="/support" className="text-blue-600 hover:underline">
              Contact support
            </Link>
          </p>
        </div>

        {/* Show error details in development */}
        {process.env.NODE_ENV === "development" && error && (
          <details className="mt-6">
            <summary className="cursor-pointer text-sm ">
              Error Details (Development)
            </summary>
            <pre className="mt-2 overflow-auto rounded p-4 text-xs">
              Error Code: {error}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
