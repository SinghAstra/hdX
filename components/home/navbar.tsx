"use client";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { containerVariant, scaleInVariant } from "@/lib/variants";
import { motion } from "framer-motion";
import { ZapIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    // Handler for scroll event
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  return (
    <div
      className={`flex items-center justify-between px-6 py-3 fixed top-0 inset-x-0 sm:inset-x-24 lg:inset-x-32 backdrop-blur-md z-[10]
        transition-all duration-300
        rounded sm:border bg-background/40
        ${scrolled ? "shadow-2xl sm:top-2" : "sm:top-6"}
      `}
    >
      <Link href="/">
        <p className="text-xl sm:text-2xl tracking-wide">{siteConfig.name}</p>
      </Link>
      <motion.div
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        className="flex items-center gap-x-4"
      >
        <ThemeToggle />
        <Link href="/sign-in">
          <motion.div
            variants={scaleInVariant}
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "hidden sm:inline rounded cursor-pointer"
            )}
          >
            Sign In
          </motion.div>
        </Link>
        <Link href="/sign-up">
          <motion.div
            variants={scaleInVariant}
            className={cn(buttonVariants({}), "rounded cursor-pointer")}
          >
            Get Started
            <ZapIcon className="size-3.5 ml-1.5 text-orange-500 fill-orange-500" />
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
};

export default Navbar;
