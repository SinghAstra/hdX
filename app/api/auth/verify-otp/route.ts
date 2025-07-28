import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    console.log(`🔍 Verifying OTP: ${token} for email: ${email}`);

    if (!email || !token) {
      return NextResponse.json(
        { message: "Email and token are required" },
        { status: 400 }
      );
    }

    const otpRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: token.toUpperCase(),
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!otpRecord) {
      console.log("❌ Invalid or expired OTP code");
      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    console.log("✅ OTP verification successful");

    // Delete the used OTP token
    // await prisma.verificationToken.delete({
    //   where: {
    //     identifier: otpRecord.identifier,
    //     token: otpRecord.token,
    //   },
    // });

    // Check if user exists, if not create them
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`👤 Creating new user: ${email}`);
      user = await prisma.user.create({
        data: {
          email,
          emailVerified: new Date(),
        },
      });
    } else {
      // Update email verification status
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      email: user.email,
    });
  } catch (error) {
    console.log("❌ OTP verification error.");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
