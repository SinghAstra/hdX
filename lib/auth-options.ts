import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { sendVerificationRequest } from "./email";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Google Credentials are required.");
}

const EMAIL_SERVER_HOST = process.env.EMAIL_SERVER_HOST;
const EMAIL_SERVER_PORT = process.env.EMAIL_SERVER_PORT;
const EMAIL_SERVER_USER = process.env.EMAIL_SERVER_USER;
const EMAIL_SERVER_PASSWORD = process.env.EMAIL_SERVER_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM;

if (
  !EMAIL_SERVER_HOST ||
  !EMAIL_SERVER_PORT ||
  !EMAIL_SERVER_USER ||
  !EMAIL_SERVER_PASSWORD ||
  !EMAIL_FROM
) {
  throw new Error("Email Credentials are required");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: EMAIL_SERVER_HOST,
        port: Number.parseInt(EMAIL_SERVER_PORT),
        auth: {
          user: EMAIL_SERVER_USER,
          pass: EMAIL_SERVER_PASSWORD,
        },
      },
      from: EMAIL_FROM,
      sendVerificationRequest,
      generateVerificationToken: () => {
        return (
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15)
        );
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
