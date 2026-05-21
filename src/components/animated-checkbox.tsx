"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
  size?: number;
  triggerConfetti?: boolean;
}

export default function AnimatedCheckbox({
  checked,
  onChange,
  className,
  size = 20,
  triggerConfetti = false
}: AnimatedCheckboxProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange();

    if (!checked && triggerConfetti) {
      // Trigger a beautiful, premium confetti blast
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#a855f7", "#6366f1", "#ec4899", "#22c55e", "#0ea5e9"]
      });
    }
  };

  const tickVariants: Variants = {
    checked: { pathLength: 1, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
    unchecked: { pathLength: 0, transition: { duration: 0.1, ease: [0.42, 0, 0.58, 1] } }
  };

  const boxVariants = {
    checked: { scale: 0.95, borderColor: "var(--accent)", backgroundColor: "rgba(168, 85, 247, 0.1)" },
    unchecked: { scale: 1, borderColor: "rgba(255, 255, 255, 0.2)", backgroundColor: "rgba(0, 0, 0, 0.2)" },
    hover: { scale: 1.05, borderColor: "var(--accent)" }
  };

  return (
    <motion.div
      variants={boxVariants}
      animate={checked ? "checked" : "unchecked"}
      whileHover="hover"
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center cursor-pointer border rounded-md select-none transition-colors",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[var(--accent)]"
        style={{ width: size * 0.7, height: size * 0.7 }}
      >
        <motion.path
          d="M20 6L9 17L4 12"
          variants={tickVariants}
          animate={checked ? "checked" : "unchecked"}
          initial="unchecked"
        />
      </svg>
    </motion.div>
  );
}
