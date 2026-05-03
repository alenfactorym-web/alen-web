"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
    });

    lenis.on("scroll", ({ scroll }) => {
     document.querySelectorAll("[data-alshafi-leaf]").forEach((leaf) => {
  const speed = Number(leaf.dataset.speed || 0.02);
  leaf.style.transform = `translate3d(0, ${scroll * speed}px, 0)`;
});
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return children;
}