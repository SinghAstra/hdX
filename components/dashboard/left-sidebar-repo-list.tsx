"use client";

import { NoteWithSkeleton } from "@/lib/interfaces/note";
import React from "react";
import EmptyNotesSidebarRepoList from "./empty-notes-sidebar-repo-list";
import NoteCard from "./note-card";

interface SidebarRepoListProps {
  notes: NoteWithSkeleton[];
  onDeleteNote: (noteId: string) => Promise<void>;
}

const SidebarRepoList = ({ notes, onDeleteNote }: SidebarRepoListProps) => {
  if (notes.length === 0) {
    return <EmptyNotesSidebarRepoList />;
  }
  return (
    <div className="h-full overflow-y-auto px-4 ">
      <div className="flex flex-col gap-4 ">
        {notes.map((note) => {
          return (
            <NoteCard key={note.id} note={note} onDeleteNote={onDeleteNote} />
          );
        })}
      </div>
    </div>
  );
};

export default SidebarRepoList;
