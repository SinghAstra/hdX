import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

function HomePage() {
  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-4xl text-center ">
        <div className="mb-8 flex items-center rounded px-4 py-2 text-sm font-medium border">
          <Star className="mr-2 h-4 w-4" />
          Trusted by thousands of users
        </div>

        <h1 className="mb-6 text-4xl sm:text-6xl font-bold tracking-tight ">
          Your thoughts deserve a{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            beautiful home
          </span>
        </h1>

        <p className="mb-10 text-xl sm:text-2xl text-muted-foreground ">
          Capture ideas, organize thoughts, and boost productivity with our
          elegant note-taking app. Simple, secure, and always in sync.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-transparent"
            >
              Sign In
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          No credit card required • Free forever • 2-minute setup
        </p>
      </div>
    </div>
  );
}

export default HomePage;
