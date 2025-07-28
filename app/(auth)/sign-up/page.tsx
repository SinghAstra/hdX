import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import SignUpClientPage from "./sign-up-client-page";

export const metadata: Metadata = {
  title: "Sign Up",
  description: `Create your ${siteConfig.name} App account to start organizing your thoughts and ideas.`,
};

export default function SignUpPage() {
  return <SignUpClientPage />;
}
