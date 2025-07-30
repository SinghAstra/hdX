"use server";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function fetchAllNotes() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { message: "Authentication required", notes: [] };
    }

    console.log("userId in server action is ", session.user.id);

    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("notes in server action is ", notes);
    return { notes };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return { message: "Failed to Fetch Notes", notes: [] };
  }
}
