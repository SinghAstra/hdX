import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

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
        port: EMAIL_SERVER_PORT,
        auth: {
          user: EMAIL_SERVER_USER,
          pass: EMAIL_SERVER_PASSWORD,
        },
      },
      from: EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/signup",
    verifyRequest: "/verify-request",
  },
  session: {
    strategy: "jwt",
  },
};
