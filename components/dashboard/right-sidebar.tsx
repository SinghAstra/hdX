"use client";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function RightSidebar() {
  return (
    <div className="w-80 hidden xl:flex p-2 ">
      <div className="border px-3 py-2 rounded flex flex-col gap-1 w-full h-fit">
        <h3>Follow For Updates</h3>
        <a
          className={cn(
            buttonVariants({
              variant: "outline",
              className:
                "w-full mt-4 tracking-wide font-normal rounded relative bg-transparent hover:bg-muted/20",
            })
          )}
          href={siteConfig.links.twitter}
          target="_blank"
        >
          Connect on X
        </a>
      </div>
    </div>
  );
}
