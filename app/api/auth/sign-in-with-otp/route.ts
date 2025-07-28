import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, userId } = await request.json();

    console.log(`🔐 Creating NextAuth session for user: ${email}`);

    if (!email || !userId) {
      return NextResponse.json(
        { error: "Email and userId are required" },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a temporary verification token that NextAuth can use
    // This allows us to use NextAuth's built-in session creation
    const tempToken = crypto.randomUUID();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.verificationToken.create({
      data: {
        identifier: `temp-signin-${email}`,
        token: tempToken,
        expires,
      },
    });

    console.log(
      `✅ Temporary token created for NextAuth integration: ${tempToken}`
    );

    // Return the token for the client to use with NextAuth signIn
    return NextResponse.json({
      success: true,
      tempToken,
      email,
      redirectUrl: "/dashboard",
    });
  } catch (error) {
    console.error("❌ Session preparation error:", error);
    return NextResponse.json(
      { error: "Failed to prepare session" },
      { status: 500 }
    );
  }
}
