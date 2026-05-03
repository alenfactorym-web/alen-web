"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBrandTheme } from "@/lib/brandTheme";
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function wrapAngle(a) {
  const pi2 = Math.PI * 2;
  a = ((a % pi2) + pi2) % pi2;
  if (a > Math.PI) a -= pi2;
  return a;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

export default function CategoryCylinder({
  items = [],
  activeSlug,
  onChange,
  dir = "ltr",
  hrefBase, // اگر بدی: کلیک = route (برای pages دیگر). اگر ندی: فقط active عوض میشه.
  compact = false,
}) {  const count = items.length;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
    const router = useRouter();
    const params = useParams();
    const brand = String(params?.brand || "").toLowerCase();
    const theme = getBrandTheme(brand);
  const step = useMemo(() => (Math.PI * 2) / count, [count]);
  const [angle, setAngle] = useState(0);
  const [active, setActive] = useState(activeSlug || items[0]?.slug || null);
  const boxRef = useRef(null);
    const snapRaf = useRef(null);
    const wheelLockRef = useRef(false);
    const isDragging = useRef(false);
  const startX = useRef(0);
  const startA = useRef(0);
  const [radius, setRadius] = useState(180);
    const movedRef = useRef(false);
    const dragThreshold = 6;
  // ... ادامه کدت
  // ... ادامه کدت  // ✅ وقتی items عوض شد (مثلاً lang) active رو معتبر کن و زاویه رو تنظیم کن
  useEffect(() => {
    const fallback = items[0]?.slug || null;

    // اگر activeSlug داده شده و تو items هست:
    const desired = activeSlug && items.some((x) => x.slug === activeSlug) ? activeSlug : null;

    // اگر active فعلی تو items نیست:
    const currentOk = active && items.some((x) => x.slug === active);

    const nextActive = desired || (currentOk ? active : fallback);

    if (nextActive && nextActive !== active) {
      setActive(nextActive);
    }

    if (nextActive) {
      const idx = items.findIndex((x) => x.slug === nextActive);
      if (idx >= 0) setAngle(wrapAngle(-idx * step));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, count, step]);

  // ✅ radius responsive
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const w = el.getBoundingClientRect().width || 0;

      if (count <= 4) {
        setRadius(clamp(w * 0.23, 110, 185));
        return;
      }

      setRadius(clamp(w * 0.34, 160, 340));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [count]);

  const getFrontIndex = (a) => {
    const raw = Math.round(-a / step);
    return mod(raw, count);
  };

  const targetAngleForIndex = (idx) => wrapAngle(-idx * step);

  const snapToNearest = (fromAngle = angle) => {
    if (snapRaf.current) cancelAnimationFrame(snapRaf.current);

    const idx = getFrontIndex(fromAngle);
    const target = targetAngleForIndex(idx);

    const start = performance.now();
    const dur = 220;

    const animate = (t) => {
      const p = clamp((t - start) / dur, 0, 1);
      const ease = 1 - Math.pow(1 - p, 3);

      const delta = wrapAngle(target - fromAngle);
      const next = wrapAngle(fromAngle + delta * ease);

      setAngle(next);

      if (p < 1) {
        snapRaf.current = requestAnimationFrame(animate);
            } else {
        setAngle(target);

        const slug = items[idx]?.slug;
        if (slug) {
          setActive(slug);
          if (slug !== active) {
            onChange?.(slug);
          }
        }

        snapRaf.current = null;
      }
    };

    snapRaf.current = requestAnimationFrame(animate);
  };

  // ✅ sync با activeSlug خارجی
 useEffect(() => {
  if (!activeSlug) return;

  const idx = items.findIndex((x) => x.slug === activeSlug);
  if (idx < 0) return;

  setActive(activeSlug);
  setAngle(targetAngleForIndex(idx));
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeSlug, items]);

 // ✅ wheel logic: پله‌به‌پله بدون پرش
  useEffect(() => {
    const onWheel = (e) => {
  const el = boxRef.current;
  if (!el) return;

  const r = el.getBoundingClientRect();
  const inside =
    e.clientX >= r.left &&
    e.clientX <= r.right &&
    e.clientY >= r.top &&
    e.clientY <= r.bottom;

  if (!inside) return;

  e.preventDefault();

  if (wheelLockRef.current) return;
  if (snapRaf.current) return;

  const d = e.deltaY > 0 ? 1 : -1;

  const currentIndex = getFrontIndex(angle);
  const nextIndex = mod(currentIndex + d, count);
  const nextAngle = targetAngleForIndex(nextIndex);

  wheelLockRef.current = true;
  snapToNearest(nextAngle);

  setTimeout(() => {
    wheelLockRef.current = false;
  }, 300);
};

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [angle, count]); // اضافه شدن count به وابستگی‌ها

  // Drag
  const onPointerDown = (e) => {
  isDragging.current = true;
  movedRef.current = false;
  startX.current = e.clientX;
  startA.current = angle;
  e.currentTarget.setPointerCapture?.(e.pointerId);
  if (snapRaf.current) cancelAnimationFrame(snapRaf.current);
};

const onPointerMove = (e) => {
  if (!isDragging.current) return;
  const dx = e.clientX - startX.current;

  if (Math.abs(dx) > dragThreshold) {
    movedRef.current = true;
  }

  const isMobileOrTablet =
    typeof window !== "undefined"
      ? window.matchMedia("(hover: none) and (pointer: coarse)").matches
      : false;

  const dragSpeed = isMobileOrTablet
    ? count <= 4
      ? 0.020   // 🔥 سریع‌تر برای موبایل
      : 0.012
    : count <= 4
    ? 0.0115
    : 0.0055;

  setAngle(wrapAngle(startA.current + dx * dragSpeed));
};const onPointerUp = () => {
  if (!isDragging.current) return;
  isDragging.current = false;

  if (movedRef.current) {
    snapToNearest();
  }
};  
const onItemClick = (slug) => {
  if (!slug) return;

if (hrefBase) {
  const url = new URL(`${hrefBase}/${slug}`, window.location.origin);

  const current = new URL(window.location.href);
  const lang = (current.searchParams.get("lang") || "en").toLowerCase();

  url.searchParams.set("lang", lang);
  url.searchParams.set("page", "1");

  router.push(`${url.pathname}${url.search}`, { scroll: false });
  return;
}  const idx = items.findIndex((x) => x.slug === slug);
  if (idx >= 0) setAngle(targetAngleForIndex(idx));

  setActive(slug);
  onChange?.(slug);
};
  const frontIndex = useMemo(() => {
  return count ? getFrontIndex(angle) : 0;
}, [angle, count, step]);

const activeLabel = useMemo(() => {
  return items[frontIndex]?.label || items.find((x) => x.slug === active)?.label || "";
}, [items, frontIndex, active]);
  const hideBack = count > 4;
  if (!count) return null;

if (!mounted) {
  return (
    <div className="relative w-full" dir={dir}>
      <div
        className={`relative ${compact ? "h-[82px]" : "h-[100px]"} select-none overflow-visible`}
      />
    </div>
  );
}

return (
  <div className="relative w-full" dir={dir}>
      {/* chip */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
        <div
         className="px-10 py-2 rounded-full border"
style={{
  borderColor: `${theme.accent}26`,
  background: `linear-gradient(90deg, transparent 0%, ${theme.accent}66 50%, transparent 100%)`,
  boxShadow: `0 0 18px ${theme.accent}22`,
}}
        >
          <span className="opacity-0 text-xs font-black whitespace-nowrap">{activeLabel}</span>
        </div>
      </div>

      {/* stage */}
      <div
  ref={boxRef}
  className={`relative ${compact ? "h-[82px]" : "h-[100px]"} select-none overflow-visible`}
  style={{
    perspective: count <= 4 ? "850px" : "1200px",
    willChange: "transform",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  }}
  onPointerDown={onPointerDown}
  onPointerMove={onPointerMove}
  onPointerUp={onPointerUp}
  onPointerCancel={onPointerUp}
>
        <div
  className="relative mx-auto h-full"
  style={{
    transformStyle: "preserve-3d",
    willChange: "transform",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  }}
>
          {items.map((it, i) => {
            const a = wrapAngle(i * step + angle);

           const t = clamp(Math.abs(a) / (Math.PI / 1.6), 0, 1);

const side = Math.sin(a) === 0 ? 0 : Math.sign(Math.sin(a));

const isDesktop =
  typeof window !== "undefined" ? window.matchMedia("(min-width: 1025px)").matches : false;

const spreadBoost = isDesktop
  ? count <= 4
    ? (1 - t) * 20
    : (1 - t) * 28
  : count <= 4
  ? (1 - t) * 12
  : (1 - t) * 18;

const x = Number((Math.sin(a) * radius + side * spreadBoost).toFixed(3));
          let z = Number((Math.cos(a) * radius).toFixed(3));

if (hideBack && z < 0) return null;
            const isFront = i === frontIndex;

            let scale = (count <= 4 ? 1.10 : 1.12) - t * (count <= 4 ? 0.26 : 0.42);scale = Number(scale.toFixed(4));

            let opacity = 1 - t * (count <= 4 ? 0.55 : 0.95);opacity = Number(opacity.toFixed(4));
                    const blurPx = Number((t * (count <= 4 ? 1.6 : 3)).toFixed(3));
            const rotateY = Number((clamp((-a * 180) / Math.PI, -65, 65)).toFixed(3));

            // ✅ active zoom + depth
            if (isFront) {
  z += count <= 4 ? 32 : 42;
  scale += count <= 4 ? 0.12 : 0.10;
  opacity = 1;
}

            return (
           <button
  key={it.slug}
  type="button"
  onPointerDown={(e) => {
    e.stopPropagation();
    movedRef.current = false;
  }}
  onPointerUp={(e) => {
    e.stopPropagation();
  }}
  onClick={(e) => {
    e.stopPropagation();
    onItemClick(it.slug);
  }}
  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
    px-5 py-2.5 rounded-full text-xs font-bold
    transition-all duration-300 ease-out select-none
    ${isFront ? "text-zinc-700" : "text-zinc-400"}`}
  style={{
    transform: `translate3d(${x}px,0,${z}px) rotateY(${rotateY}deg) scale(${scale}) translateZ(0)`,
    opacity,
    filter: isFront ? "none" : `blur(${blurPx}px)`,
    whiteSpace: "nowrap",
    willChange: "transform, opacity",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    touchAction: "none",
    WebkitTapHighlightColor: "transparent",
  }}
>
  {it.label}
</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

