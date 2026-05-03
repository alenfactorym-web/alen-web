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
      <div
        ref={scrollRef}
        className="w-full max-w-[1100px] mx-auto mt-6 mb-3 overflow-x-auto"
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
  className="inline-flex items-center shrink-0"
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

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}

