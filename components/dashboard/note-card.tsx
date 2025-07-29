"use client";

import { NoteWithSkeleton } from "@/lib/interfaces/note";
import { cn } from "@/lib/utils";
import { Loader, Trash2 } from "lucide-react";
import { useState } from "react";

interface NoteCardProps {
  note: NoteWithSkeleton;
  onDeleteNote: (noteId: string) => Promise<void>;
}

const NoteCard = ({ note, onDeleteNote }: NoteCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDeleteNote = async () => {
    setIsDeleting(true);
    await onDeleteNote(note.id);
    setIsDeleting(false);
  };

  if (note.isSkeleton) {
    return <span>Skeleton</span>;
  }

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
