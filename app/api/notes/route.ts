import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { createNoteSchema } from "@/lib/validations/note";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import * as yup from "yup";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const notes = await prisma.note.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is", error.stack);
      console.log("error.message is", error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    console.log("user is ", user);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    console.log("body is ", body);

    const validatedData = await createNoteSchema.validate(body, {
      abortEarly: false,
    });

    const note = await prisma.note.create({
      data: {
        content: validatedData.content,
        userId: user.id,
      },
    });
    console.log("note is ", note);

    revalidatePath("/dashboard");

    return NextResponse.json(
      { message: "Note created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json(
        {
          message: "Validation failed",
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      console.log("error.stack is", error.stack);
      console.log("error.message is", error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
