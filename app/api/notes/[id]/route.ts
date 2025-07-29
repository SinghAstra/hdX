import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const noteId = params.id;

    // First, verify the note exists and belongs to the user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: user.id,
      },
    });

    console.log("existingNote is ", existingNote);

    if (!existingNote) {
      return NextResponse.json(
        { message: "Note not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Delete the note
    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });

    revalidatePath("/dashboard");

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
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
