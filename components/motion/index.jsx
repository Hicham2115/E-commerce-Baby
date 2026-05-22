"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export function FadeInUp({
  children,
  delay = 0,
  duration = 0.6,
  className,
  once = true,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-80px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={fadeUpVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className,
  once = true,
  direction = "none",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-80px 0px" });

  const offset = direction === "left" ? -48 : direction === "right" ? 48 : 0;
  const yOffset = direction === "up" ? 32 : 0;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: offset, y: yOffset }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: offset, y: yOffset }
      }
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

const containerVariants = {
  hidden: {},
  visible: (staggerDelay) => ({
    transition: { staggerChildren: staggerDelay },
  }),
};

const childVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-80px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={staggerDelay}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }) {
  return (
    <motion.div className={className} variants={childVariants}>
      {children}
    </motion.div>
  );
}
