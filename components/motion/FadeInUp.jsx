"use client";

import { motion as fm } from "framer-motion";
import { motion } from "@/lib/motion";

export default function FadeInUp({ children, delay = 0 }) {
  return (
    <fm.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: motion.duration.normal,
        ease: motion.ease.smooth,
        delay,
      }}
    >
      {children}
    </fm.div>
  );
}

