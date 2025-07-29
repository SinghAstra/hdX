"use client";

import { siteConfig } from "@/config/site";
import { containerVariant, slideUpVariant } from "@/lib/variants";
import { motion } from "framer-motion";
import BorderHoverLink from "../component-x/border-hover-link";

const Footer = () => {
  return (
    <motion.div
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
    >
      <footer className="flex sticky inset-x-0 bottom-0 p-4 items-center justify-between border-t border-border mx-4 sm:mx-8 ">
        <motion.div variants={slideUpVariant}>
          <span className=" text-muted-foreground flex gap-2 items-center tracking-wider">
            Made by{" "}
            <BorderHoverLink
              href={siteConfig.links.github}
              className="text-foreground tracking-wider"
            >
              SinghAstra
            </BorderHoverLink>
          </span>
        </motion.div>
        <motion.div variants={slideUpVariant}>
          <BorderHoverLink
            href={siteConfig.links.twitter}
            className="text-foreground tracking-wider"
          >
            Connect on X
          </BorderHoverLink>
        </motion.div>
      </footer>
    </motion.div>
  );
};

export default Footer;
