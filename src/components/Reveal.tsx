"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_EDITORIAL } from "@/lib/motion";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  duration = 0.9,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, ease: EASE_EDITORIAL, delay }}
    >
      {children}
    </motion.div>
  );
}
