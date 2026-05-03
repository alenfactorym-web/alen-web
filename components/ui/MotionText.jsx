"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

// ✅ Unicode-safe split (Arabic/Kurdish OK)
function splitChars(text) {
  const s = String(text ?? "");
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(seg.segment(s), (x) => x.segment);
  }
  return Array.from(s);
}

function isSpace(ch) {
  return ch === " " || ch === "\n" || ch === "\t";
}

function MaskWrap({ children, on }) {
  if (!on) return children;

  const pad = "0.12em";

  return (
    <span
      className="inline-block overflow-hidden align-baseline"
      style={{ paddingBottom: pad, marginBottom: `-${pad}` }}
    >
      {children}
    </span>
  );
}

function buildStaggerContainer({ delay, stagger }) {
  return {
    hidden: {},
    show: { transition: { delayChildren: delay, staggerChildren: stagger } },
  };
}

function charVariants({ y, blur }) {
  return {
    hidden: { opacity: 0, y, filter: `blur(${blur}px)` },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  };
}

export function MotionTitle({
  children,
  className = "",
  as: Tag = "h2",

  reveal = "block", // "block" | "chars"
  effect = "mask", // "none" | "mask"

  stagger = 0.045,
  delay = 0.03,
  amount = 0.85,
  once = false,

  y = 18,
  blur = 10,
  duration = 0.75,

  resetKey,
}) {
  const reduce = useReducedMotion();

  const text = typeof children === "string" ? children : null;
  const chars = useMemo(() => (text ? splitChars(text) : []), [text]);

  const useMask = effect === "mask";
  const useChars = !reduce && reveal === "chars" && !!text;

  if (!useChars) {
    return (
      <motion.div
        key={resetKey ?? "mt-block"}
        initial={reduce ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once, amount }}
        variants={{
          hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
          show: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      >
        <Tag className={className}>{children}</Tag>
      </motion.div>
    );
  }

  return (
    <Tag className={className}>
      <motion.span
        key={resetKey ?? "mt-chars"}
        className="inline-block"
        initial={reduce ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once, amount }}
        variants={buildStaggerContainer({ delay, stagger })}
      >
        {chars.map((ch, i) => {
          if (isSpace(ch)) return <span key={`sp-${i}`}> </span>;

          const node = (
            <motion.span
              className="inline-block will-change-transform"
              variants={charVariants({ y, blur })}
              transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          );

          return (
            <MaskWrap key={`ch-${i}`} on={useMask}>
              {node}
            </MaskWrap>
          );
        })}
      </motion.span>
    </Tag>
  );
}

export function MotionSubtitle({
  children,
  className = "",
  as: Tag = "p",

  reveal = "block", // "block" | "chars"
  effect = "mask",

  stagger = 0.03,
  delay = 0.16,
  amount = 0.85,
  once = false,

  y = 12,
  blur = 8,
  duration = 0.7,

  resetKey,
}) {
  const reduce = useReducedMotion();

  const text = typeof children === "string" ? children : null;
  const chars = useMemo(() => (text ? splitChars(text) : []), [text]);

  const useMask = effect === "mask";
  const useChars = !reduce && reveal === "chars" && !!text;

  if (!useChars) {
    return (
      <motion.div
        key={resetKey ?? "ms-block"}
        initial={reduce ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once, amount }}
        variants={{
          hidden: { opacity: 0, y: 8, filter: "blur(5px)" },
          show: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      >
        <Tag className={className}>{children}</Tag>
      </motion.div>
    );
  }

  return (
    <Tag className={className}>
      <motion.span
        key={resetKey ?? "ms-chars"}
        className="inline-block"
        initial={reduce ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once, amount }}
        variants={buildStaggerContainer({ delay, stagger })}
      >
        {chars.map((ch, i) => {
          if (isSpace(ch)) return <span key={`sp-${i}`}> </span>;

          const node = (
            <motion.span
              className="inline-block will-change-transform"
              variants={charVariants({ y, blur })}
              transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          );

          return (
            <MaskWrap key={`ch-${i}`} on={useMask}>
              {node}
            </MaskWrap>
          );
        })}
      </motion.span>
    </Tag>
  );
}

