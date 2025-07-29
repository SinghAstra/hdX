"use client";

import { fetchAllNotes } from "@/lib/api";
import { Note } from "@prisma/client";
import useSWR from "swr";
import SidebarRepoList from "./left-sidebar-repo-list";

interface LeftSidebarProps {
  initialNotes: Note[];
}

export function LeftSidebar({ initialNotes }: LeftSidebarProps) {
  const { data: notes } = useSWR<Note[]>(fetchAllNotes, {
    fallbackData: initialNotes,
  });

  return (
    <div className="w-full lg:fixed lg:inset-y-0 lg:left-0 lg:w-96 bg-background lg:border-r lg:border-dashed lg:pt-16">
      <div className="flex flex-col h-full my-4">
        {notes && <SidebarRepoList notes={notes} />}
      </div>
    </div>
  );
}
