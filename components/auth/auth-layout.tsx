"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

export function AuthLayout({
  children,
  showBackButton = true,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen ">
      <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
        {showBackButton && (
          <div className="absolute top-4 left-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home
              </Button>
            </Link>
          </div>
        )}

        {/* Form container */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-8 px-4 shadow-xl rounded-lg sm:px-10 border ">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
