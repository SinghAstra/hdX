import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import SignInClientPage from "./sign-in-client-page";

export const metadata: Metadata = {
  title: "Sign In",
  description: `Sign In to your ${siteConfig.name} App account to start organizing your thoughts and ideas.`,
};

export default function SignUpPage() {
  return <SignInClientPage />;
}
