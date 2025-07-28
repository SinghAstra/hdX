import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Google Credentials are required.");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    // Custom credentials provider for OTP-verified users
    CredentialsProvider({
      id: "otp-sign-in",
      name: "OTP Sign In",
      credentials: {
        email: { label: "Email", type: "email" },
        tempToken: { label: "Temp Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.tempToken) {
            console.log("❌ Missing credentials for OTP sign-in");
            return null;
          }

          console.log(`🔐 Authorizing OTP sign-in for: ${credentials.email}`);

          const tokenRecord = await prisma.verificationToken.findFirst({
            where: {
              identifier: `temp-signin-${credentials.email}`,
              token: credentials.tempToken,
              expires: {
                gt: new Date(),
              },
            },
          });

          if (!tokenRecord) {
            console.log("❌ Invalid or expired temporary token");
            return null;
          }

          // Get the user
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.log("❌ User not found for OTP sign-in");
            return null;
          }

          // Clean up the temporary token
          await prisma.verificationToken.deleteMany({
            where: {
              identifier: tokenRecord.identifier,
              token: tokenRecord.token,
            },
          });

          console.log(`✅ OTP sign-in authorized for: ${user.email}`);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("❌ OTP authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        console.log("🔐 Sign in attempt:", {
          provider: account?.provider,
          email: user.email,
          userId: user.id,
        });

        if (account?.provider === "google") {
          console.log("✅ Google sign-in successful for:", user.email);
        } else if (account?.provider === "email") {
          console.log("✅ Email verification successful for:", user.email);
        }

        return true;
      } catch (error) {
        console.log("❌ Sign in error.");
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        return false;
      }
    },
    async session({ session, token }) {
      try {
        if (token.sub) {
          session.user.id = token.sub;
        }
        if (token.email) {
          session.user.email = token.email;
        }

        console.log("📋 Session created for user:", session.user.id);
        return session;
      } catch (error) {
        console.log("❌ Session callback error.");
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        return session;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    error: "/error",
  },
  session: {
    strategy: "jwt",
  },
};
