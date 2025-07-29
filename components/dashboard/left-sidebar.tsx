"use client";

import { fetchAllNotes } from "@/lib/api";
import { Note } from "@prisma/client";
import useSWR from "swr";
import { useToastContext } from "../providers/toast";
import SidebarRepoList from "./left-sidebar-repo-list";

interface LeftSidebarProps {
  initialNotes: Note[];
}

export function LeftSidebar({ initialNotes }: LeftSidebarProps) {
  const { setToastMessage } = useToastContext();
  const { data: notes, mutate: mutateNotes } = useSWR<Note[]>(fetchAllNotes, {
    fallbackData: initialNotes,
  });

  const handleDeleteNote = async (noteId: string) => {
    try {
      const updatedNotes = notes?.filter((note) => note.id !== noteId) || [];
      mutateNotes(updatedNotes, false);

      // Make the API call
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete note");
      }

      setToastMessage("Note deleted successfully!");

      // Revalidate to ensure we have the latest data from server
      mutateNotes();
    } catch (error) {
      // Revert optimistic update on error
      mutateNotes(notes, false);

      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
        setToastMessage(error.message);
      } else {
        setToastMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="w-full lg:fixed lg:inset-y-0 lg:left-0 lg:w-96 bg-background lg:border-r lg:border-dashed lg:pt-16">
      <div className="flex flex-col h-full my-4">
        {notes && (
          <SidebarRepoList notes={notes} onDeleteNote={handleDeleteNote} />
        )}
      </div>
    </div>
  );
}
