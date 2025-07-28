import { sendOtpEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

function generateOtpCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    console.log(`📧 Generating OTP for: ${email}`);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    console.log(`🎫 Generated OTP: ${otpCode} for ${email}`);

    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email,
      },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otpCode,
        expires: expiresAt,
      },
    });

    // Send the OTP email
    await sendOtpEmail(email, otpCode);

    console.log(`✅ OTP sent successfully to: ${email}`);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log("❌ Failed to send OTP.");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      { message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
