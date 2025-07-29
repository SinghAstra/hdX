import { cn } from "@/lib/utils";
import { scaleInVariant } from "@/lib/variants";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface DialogProps {
  isDialogVisible: boolean;
  setIsDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  keyToMakeDialogVisible?: string;
  className?: string;
}

const Dialog = ({
  isDialogVisible,
  setIsDialogVisible,
  children,
  keyToMakeDialogVisible,
  className,
}: DialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        setIsDialogVisible(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === keyToMakeDialogVisible) {
        e.preventDefault();
        setIsDialogVisible(true);
      }
      if (e.key === "Escape") {
        setIsDialogVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    if (isDialogVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isDialogVisible, setIsDialogVisible, keyToMakeDialogVisible]);

  if (!isDialogVisible) return;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-[999]">
      <div className="absolute inset-0 bg-background/20 backdrop-blur-md z-[-1]" />

      <motion.div
        variants={scaleInVariant}
        initial="hidden"
        animate="visible"
        className={cn(
          "w-full max-w-xl mx-4 bg-background border border-neutral-800/60 rounded shadow-2xl relative cursor-pointer z-[1000]",
          className
        )}
        ref={dialogRef}
      >
        {children}
      </motion.div>
    </div>,
    document.body
  );
};

export default Dialog;
