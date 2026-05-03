"use client";

import { motion, useAnimation, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { getBrandTheme } from "@/lib/brandTheme";

export default function SectionHeader({
  title,
  subtitle,
  resetKey,

  // ✅ قابل کنترل برای بزرگ/کوچیک کردن هر سکشن
  titleClassName = "text-3xl md:text-5xl font-black text-zinc-500",
  subtitleClassName = "mt-4 text-zinc-500 max-w-2xl mx-auto text-base md:text-lg",
  arcClassName = "mx-auto mt-3 w-[180px] h-[18px]",
}) {
  const reduce = useReducedMotion();
    const params = useParams();
    const brand = String(params?.brand || "").toLowerCase();
    const theme = getBrandTheme(brand);
  // ✅ arc replay on scroll + replay on resetKey change
  const arcWrapRef = useRef(null);
  const arcInView = useInView(arcWrapRef, { amount: 0.85 });
  const arcControls = useAnimation();

  useEffect(() => {
    if (reduce) return;

    if (arcInView) {
      arcControls.set("hidden");
      arcControls.start("show");
    } else {
      arcControls.set("hidden");
    }
  }, [arcInView, arcControls, reduce, resetKey]);

  const arcVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1 },
  };

  return (
    <div className="text-center mb-10">
      {/* ✅ دیگه سایز رو قفل نمی‌کنیم؛ با titleClassName کنترل میشه */}
      <div className={titleClassName}>{title}</div>

      {theme.sectionArc === "line" ? (
<div className="mx-auto mt-3 w-[140px] md:w-[180px] lg:w-[200px] h-[3px]">
    <div
      className="w-full h-full rounded-full"
      style={{ backgroundColor: theme.accent }}
    />
  </div>
) : theme.sectionArc !== "none" && (
  <div ref={arcWrapRef} className={arcClassName}>
        <svg viewBox="0 0 200 30" className="w-full h-full">
          <motion.path
            key={`arc-${resetKey || "base"}`} // ✅ ریست با تغییر زبان/صفحه
            d="M10 20 C 60 5, 140 5, 190 20"
            fill="none"
            stroke={theme.accent}
            strokeWidth="8"
            strokeLinecap="round"
            variants={arcVariants}
            initial={reduce ? { pathLength: 1, opacity: 1 } : "hidden"}
            animate={reduce ? { pathLength: 1, opacity: 1 } : arcControls}
            transition={{
              delay: 0.06,
              duration: 1.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </svg>
     </div>
)}

{subtitle ? <div className={subtitleClassName}>{subtitle}</div> : null}
    </div>
  );
}

