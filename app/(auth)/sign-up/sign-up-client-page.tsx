"use client";

import type React from "react";

import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { SignUpFormData, signUpSchema } from "@/lib/validations/auth";
import * as yup from "yup";

function SignUpClientPage() {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    dob: undefined, // Initialize as undefined
    email: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormData, string>>
  >({});

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Validate on change using Yup
    try {
      await signUpSchema.validateAt(id, { [id]: value });
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [id]: error.message }));
      }
    }
  };

  const handleDateChange = async (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, dob: date }));
    // Validate date on change using Yup
    try {
      await signUpSchema.validateAt("dob", { dob: date });
      setErrors((prev) => ({ ...prev, dob: undefined }));
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors((prev) => ({ ...prev, dob: error.message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signUpSchema.validate(formData, { abortEarly: false }); // Validate all fields
      setErrors({}); // Clear all errors on successful validation
      console.log("Form data submitted:", formData);
      // Here you would typically send the data to your backend
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path as keyof SignUpFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="w-full flex min-h-screen p-4">
      <div className="p-8 space-y-6 flex-1 flex flex-col items-center justify-center relative">
        <div className="flex items-center space-x-2 md:absolute md:top-0 md:left-0">
          <Loader className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            {siteConfig.name}
          </span>
        </div>

        <div className="space-y-2 w-full">
          <h1 className="text-3xl font-bold text-foreground">Sign up</h1>
          <p className="text-muted-foreground">
            Sign up to enjoy the feature of {siteConfig.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
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

          <Button type="submit" className="w-full">
            Get OTP
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline text-primary">
            Sign In
          </Link>
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
