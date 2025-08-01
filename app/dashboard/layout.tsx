import { LeftSidebar } from "@/components/dashboard/left-sidebar";
import { Navbar } from "@/components/dashboard/navbar";
import { RightSidebar } from "@/components/dashboard/right-sidebar";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { fetchAllNotes } from "./actions";

interface DashboardLayoutProps {
  children: ReactNode;
}

export async function generateMetadata() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  return {
    title: `Dashboard `,
    description: `Welcome to your dashboard, ${session.user.name}`,
  };
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  const { notes } = await fetchAllNotes();

  return (
    <div className="min-h-screen">
      <Navbar user={session.user} />
      <div className="flex">
        <LeftSidebar initialNotes={notes} />
        <main className="hidden lg:flex flex-1 ml-96">{children}</main>
        <RightSidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;
