import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded shadow-sm border p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">
                Welcome to your Dashboard!
              </h1>
              <p className=" mb-6">
                Hello {session.user.name}! Your email verification was
                successful.
              </p>

              <div className="rounded border p-6 mb-6">
                <h2 className="font-semibold mb-2">
                  🎉 Authentication Complete!
                </h2>
                <p className="text-sm">
                  You have successfully verified your email and are now signed
                  in to Notes App.
                </p>
              </div>

              <div className="text-left max-w-md mx-auto">
                <h3 className="font-semibold mb-3">Your Account Details:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="">Email:</span>
                    <span className="font-medium">{session.user?.email}</span>
                  </div>
                  {session.user?.name && (
                    <div className="flex justify-between">
                      <span className="">Name:</span>
                      <span className="font-medium">{session.user.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="">User ID:</span>
                    <span className="font-mono text-xs">
                      {session.user?.id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 rounded">
                <p className="text-sm">
                  <strong>Coming Soon:</strong> Note creation, editing, and
                  management features will be available in the next update!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
