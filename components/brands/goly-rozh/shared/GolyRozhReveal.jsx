"use client";

import { useEffect, useRef, useState } from "react";

export default function GolyRozhReveal({
  children,
  className = "",
  threshold = 0.3,
  replayKey = "default",
}) {
  const elementRef = useRef(null);
  const [visibleCycle, setVisibleCycle] = useState(null);

  const cycleKey = String(replayKey);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisibleCycle(cycleKey);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setVisibleCycle(cycleKey);
        observer.disconnect();
      },
      {
        threshold,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, cycleKey]);

  const isVisible = visibleCycle === cycleKey;

  return (
    <div
      ref={elementRef}
      className={[
        "goly-rozh-reveal",
        isVisible ? "is-visible" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}