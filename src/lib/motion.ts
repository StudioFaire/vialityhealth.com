import type { Easing, Variants } from "framer-motion";

export const EASE_EDITORIAL: Easing = [0.25, 0.1, 0.25, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_EDITORIAL, delay },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 1, ease: "easeOut", delay },
  }),
};

export const staggerContainer = (stagger: number = 0.12): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
});
