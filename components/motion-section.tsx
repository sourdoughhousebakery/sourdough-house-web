"use client";

import { motion, useReducedMotion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

type MotionSectionProps = HTMLMotionProps<"section"> & {
  children: ReactNode;
};

export function MotionSection({ children, className = "", ...props }: MotionSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial={false}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.section>
  );
}
