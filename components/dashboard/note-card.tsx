"use client";

import { useToastContext } from "@/components/providers/toast";
import { cn } from "@/lib/utils";
import type { Note } from "@prisma/client";
import { Loader, Trash2 } from "lucide-react";
import { useState } from "react";

interface NoteCardProps {
  note: Note;
  onNoteDeleted?: (noteId: string) => void;
}

const NoteCard = ({ note, onNoteDeleted }: NoteCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { setToastMessage } = useToastContext();

  const handleDeleteNote = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete note");
      }

      setToastMessage("Note deleted successfully!");

      if (onNoteDeleted) {
        onNoteDeleted(note.id);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
        setToastMessage(error.message);
      } else {
        setToastMessage("An unexpected error occurred");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative px-3 py-2 rounded-md border transition-all duration-200",
        "hover:border-muted-foreground/20 hover:bg-muted/30",
        "bg-card text-card-foreground"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="pr-8">
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {note.content}
        </p>
        <div className="mt-2 text-xs text-muted-foreground">
          {new Date(note.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      <div
        className={cn(
          "absolute top-2 right-2 transition-all duration-200",
          isHovered || isDeleting ? "opacity-100" : "opacity-0"
        )}
      >
        <button
          onClick={handleDeleteNote}
          disabled={isDeleting}
          className={cn(
            "p-1.5 rounded-md transition-colors duration-200",
            "hover:bg-destructive/10 hover:text-destructive",
            "focus:outline-none focus:ring-2 focus:ring-destructive/20",
            "text-muted-foreground"
          )}
          aria-label="Delete note"
        >
          {isDeleting ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
