import { authOptions } from "@/lib/auth-options";
import { verifyEmailConfig } from "@/lib/email";
import NextAuth from "next-auth/next";

if (process.env.NODE_ENV === "development") {
  verifyEmailConfig().catch((error) => {
    console.log("Email Config Verification failed.");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
  });
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
