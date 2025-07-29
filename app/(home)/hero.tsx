"use client";

import MovingBackground from "@/components/component-x/moving-background";
import MovingBorder from "@/components/component-x/moving-border";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import {
  blurInVariant,
  containerVariant,
  scaleInVariant,
} from "@/lib/variants";
import { motion } from "framer-motion";
import { ArrowRight, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { FaGithub, FaTwitter } from "react-icons/fa";

function Hero() {
  return (
    <motion.div
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      className="relative flex flex-col gap-8 items-center text-center min-h-screen justify-center px-4 overflow-hidden"
    >
      <motion.div variants={scaleInVariant}>
        <a href={siteConfig.links.twitter} target="_blank">
          <div className="p-1 relative rounded">
            <Button
              variant="outline"
              className="rounded group relative font-normal bg-transparent hover:bg-muted/40"
            >
              <MovingBackground shineColor="hsl(var(--muted)/20)" />
              <span className=" text-sm text-foreground flex items-center justify-center gap-2">
                <FaTwitter className="size-3" /> Follow For Updates
                <ArrowRightIcon className="size-3 transform-all duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
          </div>
        </a>
      </motion.div>

      <motion.h1
        variants={blurInVariant}
        className=" font-medium text-5xl tracking-tight md:text-6xl lg:text-7xl my-2 sm:my-4 "
      >
        Your thoughts deserve a
        <br />
        <span className="text-orange-500 font-medium mx-2">
          beautiful home.
        </span>
      </motion.h1>

      <div className="flex flex-col sm:flex-row gap-4 sm:mt-4 items-center ">
        <Link href="/sign-up">
          <motion.div variants={scaleInVariant} className="w-full sm:w-fit">
            <Button
              size="lg"
              className="group rounded relative flex items-center gap-1 text-md backdrop-blur-md w-full "
            >
              Get Started For Free
              <ArrowRight className="ml-2 h-4 w-4 transition-all duration-200 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </Link>
        <motion.div variants={scaleInVariant} className="w-full sm:w-fit">
          <a href={siteConfig.links.githubRepo} target="_blank">
            <div className="p-[2px] relative z-[2] overflow-hidden rounded w-full">
              <MovingBorder />
              <Button
                variant={"outline"}
                size="lg"
                className="flex items-center text-md justify-center gap-2 rounded font-normal z-3 relative backdrop-blur-lg w-full"
              >
                <FaGithub className=" h-4 w-4" />
                View on GitHub
              </Button>
            </div>
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Hero;
