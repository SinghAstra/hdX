import { Note } from "@prisma/client";

export interface NoteWithSkeleton extends Note {
  isSkeleton?: boolean;
}
