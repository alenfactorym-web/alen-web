"use client";

import { useEffect, useRef, useState } from "react";

export default function SpiceOverlayHover({
  className = "",
  imgSrc = "/overlays/spice.png",
  videoSrc = "/overlays/spice-black.webm",
}) {
  const vA = useRef(null);
  const vB = useRef(null);

  const swappingRef = useRef(false);
  const isTouchRef = useRef(false); // تشخیص موبایل بدون ایجاد mismatch

  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(0); // 0 = A active, 1 = B active

  // ✅ تنظیمات
  const LOOP_END = 3.7;
  const FADE_SEC = 0.28;

  const getActiveVideo = () => (active === 0 ? vA.current : vB.current);
  const getNextVideo = () => (active === 0 ? vB.current : vA.current);

  useEffect(() => {
    // ✅ موبایل/لمسی
    if (typeof window !== "undefined") {
      isTouchRef.current =
        window.matchMedia?.("(hover: none) and (pointer: coarse)")?.matches ?? false;
    }
  }, []);

  const hardResetBoth = () => {
    const a = vA.current;
    const b = vB.current;

    try {
      if (a) {
        a.pause();
        a.currentTime = 0;
      }
      if (b) {
        b.pause();
        b.currentTime = 0;
      }
    } catch {}

    swappingRef.current = false;
    setActive(0);
  };

  const startPlayback = async () => {
    const a = vA.current;
    const b = vB.current;
    if (!a || !b) return;

    swappingRef.current = false;
    setActive(0);

    try {
      a.currentTime = 0;
      b.pause();
      b.currentTime = 0;
      await a.play();
    } catch {
      // silent
    }
  };

  const crossfadeSwap = async () => {
    if (swappingRef.current) return;
    swappingRef.current = true;

    const current = getActiveVideo();
    const next = getNextVideo();
    if (!current || !next) {
      swappingRef.current = false;
      return;
    }

    try {
      next.currentTime = 0;
      await next.play();
    } catch {
      swappingRef.current = false;
      return;
    }

    setActive((x) => (x === 0 ? 1 : 0));

    window.setTimeout(() => {
      try {
        current.pause();
        current.currentTime = 0;
      } catch {}
      swappingRef.current = false;
    }, Math.round(FADE_SEC * 1000) + 40);
  };

  // ✅ به جای RAF: فقط وقتی ویدئو فعاله timeupdate گوش می‌کنیم (سبک‌تر برای اندروید)
  useEffect(() => {
    if (!hovered) return;

    const current = getActiveVideo();
    if (!current) return;

    const onTime = () => {
      const t = current.currentTime || 0;

      // موبایل: کراس‌فید لازم نیست، فقط قبل از بخش خالی برگردون اول
      if (isTouchRef.current) {
        if (t >= LOOP_END - 0.02) {
          try {
            current.currentTime = 0;
            // اگر به هر دلیل pause شد دوباره play
            if (current.paused) current.play().catch(() => {});
          } catch {}
        }
        return;
      }

      // دسکتاپ: کراس‌فید مثل قبل
      if (t >= LOOP_END - FADE_SEC * 0.9) {
        crossfadeSwap();
      }
    };

    current.addEventListener("timeupdate", onTime);
    return () => current.removeEventListener("timeupdate", onTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered, active]);

  // دسکتاپ hover
  const onEnter = async () => {
    if (isTouchRef.current) return; // موبایل با tap
    setHovered(true);
    await startPlayback();
  };

  const onLeave = () => {
    if (isTouchRef.current) return;
    setHovered(false);
    hardResetBoth();
  };

  // موبایل tap
  const onTapToggle = async (e) => {
    if (!isTouchRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    setHovered((v) => !v);

    // اگر روشن می‌کنیم
    const nextHovered = !hovered;
    if (nextHovered) {
      await startPlayback();
    } else {
      hardResetBoth();
    }
  };

  const maskStyle = {
    pointerEvents: "none",
    WebkitMaskImage: "radial-gradient(ellipse at center, black 62%, transparent 90%)",
    maskImage: "radial-gradient(ellipse at center, black 62%, transparent 90%)",
  };

  return (
    <div
      className={`relative w-full h-full ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onPointerDown={onTapToggle}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* PNG */}
      <img
        src={imgSrc}
        alt="Spices"
        draggable={false}
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-200 ${
          hovered ? "opacity-0" : "opacity-100"
        }`}
        style={{ pointerEvents: "none" }}
      />

      {/* Video Layer */}
      <div
        className={`absolute inset-0 transition-opacity duration-200 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
        style={maskStyle}
      >
       {/* Video A */}
<video
  ref={vA}
  src={videoSrc}
  muted
  playsInline
  preload="metadata"
  controls={false}
  controlsList="nodownload noplaybackrate noremoteplayback"
  disablePictureInPicture
  onContextMenu={(e) => e.preventDefault()}
  className="absolute inset-0 w-full h-full object-contain"
  style={{
    opacity: active === 0 ? 1 : 0,
    transition: `opacity ${FADE_SEC}s ease-in-out`,
    filter: "brightness(1.15) contrast(1.2) saturate(1.15)",
  }}
/>

{/* Video B */}
<video
  ref={vB}
  src={videoSrc}
  muted
  playsInline
  preload="metadata"
  controls={false}
  controlsList="nodownload noplaybackrate noremoteplayback"
  disablePictureInPicture
  onContextMenu={(e) => e.preventDefault()}
  className="absolute inset-0 w-full h-full object-contain"
  style={{
    opacity: active === 1 ? 1 : 0,
    transition: `opacity ${FADE_SEC}s ease-in-out`,
    filter: "brightness(1.15) contrast(1.2) saturate(1.15)",
  }}
/>
      </div>
    </div>
  );
}

