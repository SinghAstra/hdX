import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border p-6 shadow-sm">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold ">Check your email</h1>
            <p className="mt-1 text-sm">
              We&apos;ve sent you a verification link. Click the link in the
              email to sign in.
            </p>
          </div>

          <div className="space-y-1">
            <div className="rounded-lg p-4 text-blue-700">
              <h3 className="font-medium">What&apos;s next?</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Check your email inbox</li>
                <li>• Click the verification link</li>
                <li>• You&apos;ll be automatically signed in</li>
              </ul>
            </div>

            <div className="rounded-lg p-4 text-yellow-700">
              <h3 className="font-medium">Didn&apos;t receive the email?</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Check your spam folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• Try signing in again to resend</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link href="/login">
              <Button className="w-full">Try signing in again</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
