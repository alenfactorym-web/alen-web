"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
function pickLang(obj, lang) {
  if (!obj) return "";
  if (lang === "ar") return obj.ar || obj.en || "";
  if (lang === "ku") return obj.ku || obj.en || "";
  return obj.en || "";
}

export default function CategoryBlurBar({
  categories = [],
  activeCategory,
  brand,
  lang = "en",
}) {
  const [hovered, setHovered] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const safeLang = (lang || "en").toLowerCase();

  const scrollRef = useRef(null);
const itemRefs = useRef(new Map());

const [edges, setEdges] = useState({
  left: false,
  right: false,
});

useEffect(() => {
  const bar = scrollRef.current;
  if (!bar) return;

  const updateEdges = () => {
    const bounds = bar.getBoundingClientRect();
    const tabs = Array.from(itemRefs.current.values());

    const left = tabs.some(
      (tab) => tab.getBoundingClientRect().left < bounds.left - 2
    );

    const right = tabs.some(
      (tab) => tab.getBoundingClientRect().right > bounds.right + 2
    );

    setEdges((prev) =>
      prev.left === left && prev.right === right
        ? prev
        : { left, right }
    );
  };

  const observer = new ResizeObserver(updateEdges);

  observer.observe(bar);

  Array.from(itemRefs.current.values()).forEach((tab) => {
    observer.observe(tab);
  });

  bar.addEventListener("scroll", updateEdges, { passive: true });
  window.addEventListener("resize", updateEdges);

  const frame = requestAnimationFrame(updateEdges);

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    bar.removeEventListener("scroll", updateEdges);
    window.removeEventListener("resize", updateEdges);
  };
}, [categories, activeCategory, safeLang]);

const moveByArrow = (direction) => {
  const bar = scrollRef.current;
  if (!bar) return;

  const bounds = bar.getBoundingClientRect();

  const hidden = Array.from(itemRefs.current.values()).filter((tab) => {
    const rect = tab.getBoundingClientRect();

    return direction === "left"
      ? rect.left < bounds.left - 2
      : rect.right > bounds.right + 2;
  });

  if (!hidden.length) return;

  const target = hidden.reduce((closest, tab) => {
    if (!closest) return tab;

    const rect = tab.getBoundingClientRect();
    const other = closest.getBoundingClientRect();

    return direction === "left"
      ? rect.right > other.right ? tab : closest
      : rect.left < other.left ? tab : closest;
  }, null);

  target.scrollIntoView({
  behavior: "smooth",
  block: "nearest",
  inline: direction === "left" ? "start" : "end",
});

window.setTimeout(() => {
  const barRect = bar.getBoundingClientRect();
  const tabs = Array.from(itemRefs.current.values());

  let nearestTab = null;
  let nearestDistance = Infinity;

  tabs.forEach((tab) => {
    const rect = tab.getBoundingClientRect();
    const distance = Math.abs(rect.left - barRect.left);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestTab = tab;
    }
  });

   nearestTab?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "start",
  });
}, 380);

};

useEffect(() => {
  if (typeof window === "undefined") return;

  const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
  const update = () => setIsTouchDevice(mq.matches);
    update();

    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }

    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  useEffect(() => {
    if (!isTouchDevice) return;
    if (!activeCategory) return;

    const container = scrollRef.current;
    const activeEl = itemRefs.current.get(activeCategory);

    if (!container || !activeEl) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();

    const currentScroll = container.scrollLeft;
    const itemCenter = itemRect.left - containerRect.left + currentScroll + itemRect.width / 2;
    const targetScroll = itemCenter - containerRect.width / 2;

    container.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: "smooth",
    });
  }, [activeCategory, isTouchDevice]);

  return (
  <>
    <div className="relative w-full max-w-[1100px] mx-auto mt-6 mb-3">

      <button
        type="button"
        className="alenCatArrow alenCatArrowLeft"
        data-visible={edges.left}
        aria-label="Previous categories"
        aria-hidden={!edges.left}
        tabIndex={edges.left ? 0 : -1}
        onClick={() => moveByArrow("left")}
      >
        ‹
      </button>

     <div
  ref={scrollRef}
  className="w-full overflow-x-auto alenCatScroll"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          className="flex items-center gap-6 px-2 min-w-max h-[32px]"
          onMouseLeave={() => {
            if (!isTouchDevice) setHovered(null);
          }}
        >
          {categories.map((c) => {
            const slug = c.slug;
            const label = pickLang(c.title, safeLang);

            const isActive = slug === activeCategory;
            const isHovered = hovered === slug;

            const shouldFocus = isTouchDevice
              ? true
              : isHovered || (!hovered && isActive);

            return (
              <Link
  key={slug}
  ref={(node) => {
    if (node) itemRefs.current.set(slug, node);
    else itemRefs.current.delete(slug);
  }}
  href={`/brand/${brand}/products/${slug}?lang=${safeLang}`}
  onMouseEnter={() => {
    if (!isTouchDevice) setHovered(slug);
  }}
  className="inline-flex items-center shrink-0 snap-start"
>
                <span
                  className={`
                    relative text-sm font-bold whitespace-nowrap transition-all duration-300
                    leading-none flex items-center h-full
                    ${
                      shouldFocus
                        ? isActive
                          ? "text-zinc-900 opacity-100 blur-0"
                          : "text-zinc-700 opacity-100 blur-0"
                        : "text-zinc-400 opacity-60 blur-[2px]"
                    }
                  `}
                >
                  {
                                (isActive || (!isTouchDevice && isHovered)) && (
  <span className="absolute inset-x-[-10px] inset-y-[-6px] rounded-full bg-yellow-400/55 blur-lg -z-10" />
)}

                  <span className="relative z-10">{label}</span>
                </span>
             </Link>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="alenCatArrow alenCatArrowRight"
        data-visible={edges.right}
        aria-label="Next categories"
        aria-hidden={!edges.right}
        tabIndex={edges.right ? 0 : -1}
        onClick={() => moveByArrow("right")}
      >
        ›
      </button>

    </div>

   <style jsx>{`
  div::-webkit-scrollbar {
    display: none;
  }

  .alenCatArrow {
    display: none;
  }

 @media (max-width: 767px) and (orientation: portrait),
       (min-width: 768px) and (max-width: 1180px) and (orientation: portrait),
       (max-width: 932px) and (max-height: 550px) and (orientation: landscape),
       (min-width: 768px) and (max-width: 1366px) and (orientation: landscape) {

    .alenCatArrow {
      position: absolute;
      z-index: 5;
      top: 50%;

      display: flex;
      align-items: center;
      justify-content: center;

      width: 28px;
      height: 32px;

      padding: 0;
      border: 0;

background: transparent;
color: #a88318;      font-size: 29px;
      font-weight: 300;
      line-height: 1;

      opacity: 0;
      pointer-events: none;

      transform: translateY(-50%) scale(0.88);

      transition:
        opacity 220ms ease,
        transform 300ms ease;
    }

    .alenCatArrow[data-visible="true"] {
      opacity: 0.9;
      pointer-events: auto;
      transform: translateY(-50%) scale(1);
    }

    .alenCatArrowLeft {
      left: 0;
      border-radius: 0 10px 10px 0;
    }

   .alenCatArrowRight {
  right: 0;
  border-radius: 10px 0 0 10px;
}

.alenCatScroll {
  width: calc(100% - 56px);
  margin-inline: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 8px;
}
  }
`}</style>
    </>
  );
}

