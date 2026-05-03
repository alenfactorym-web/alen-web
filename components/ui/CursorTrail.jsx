"use client";

import { useEffect, useRef } from "react";

export default function CursorTrail({
  disabledOnTouch = true,

  // طول رد
  fade = 0.5,
  lifeMs = 520,

  // ذرات
  spawn = 14,
  spread = 22,
  minR = 0.7,
  maxR = 2.2,
  blur = 10,
  strength = 0.65,

  // رنگ‌ها
  colors = null, // [[r,g,b], ...]
  color = [255, 220, 90], // fallback

  // ظاهر
  opacity = 0.8,
  swirl = 0.9,

  // فعلاً unused (می‌تونیم بعداً یا پیاده‌سازی کنیم یا حذفش کنیم)
  maskToPattern = true,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  // وضعیت‌های runtime
  const runningRef = useRef(false);
  const pausedByHiddenRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1) Reduced motion => خاموش
    const rm = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (rm?.matches) return;

    // 2) Touch / coarse pointer => خاموش (اگر خواستی)
    if (disabledOnTouch) {
      const mq = window.matchMedia?.("(hover: none) and (pointer: coarse)");
      const tp = navigator?.maxTouchPoints ?? 0;
      const isTouch = (mq?.matches ?? false) || tp > 0;
      if (isTouch) return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    let w = 0,
      h = 0;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const particles = [];
    const rand = (a, b) => a + Math.random() * (b - a);

    const pick = () => {
      if (Array.isArray(colors) && colors.length) {
        return colors[(Math.random() * colors.length) | 0];
      }
      return color;
    };

    const spawnDust = (x, y, speed01) => {
      const n = Math.floor(spawn * (0.4 + speed01 * 0.9));

      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = rand(0, spread * (0.6 + speed01));
        const px = x + Math.cos(ang) * dist;
        const py = y + Math.sin(ang) * dist;

        const tang = ang + Math.PI / 2;
        const swirlPower = swirl * (0.35 + speed01 * 0.65);

        const vx =
          rand(-0.25, 0.25) * (0.8 + speed01) +
          Math.cos(tang) * rand(-0.18, 0.45) * swirlPower;

        const vy =
          rand(-0.25, 0.25) * (0.8 + speed01) +
          Math.sin(tang) * rand(-0.18, 0.45) * swirlPower;

        const c = pick();

        particles.push({
          x: px,
          y: py,
          vx,
          vy,
          r: rand(minR, maxR) * (0.8 + speed01 * 0.4),
          a: strength * rand(0.45, 1),
          c,
          t: performance.now(),
        });
      }
    };

    let lastX = w / 2;
    let lastY = h / 3;
    let lastT = performance.now();

    // برای کم‌کردن مصرف CPU: اگر مدت کوتاهی حرکت نبود، draw رو stop می‌کنیم
    let lastMoveAt = performance.now();

    const ensureRunning = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(draw);
    };

    const stopRunning = () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    const onMove = (e) => {
      const now = performance.now();
      lastMoveAt = now;

      const x = e.clientX;
      const y = e.clientY;

      const dt = Math.max(8, now - lastT);
      const dx = x - lastX;
      const dy = y - lastY;

      const speed01 = Math.min(1, (Math.hypot(dx, dy) / dt) * 18);

      const steps = Math.max(1, Math.floor(Math.hypot(dx, dy) / 18));
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        spawnDust(lastX + dx * t, lastY + dy * t, speed01);
      }

      lastX = x;
      lastY = y;
      lastT = now;

      // اگر متوقف شده بود، دوباره روشنش کن
      if (!pausedByHiddenRef.current) ensureRunning();
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        pausedByHiddenRef.current = true;
        stopRunning();
      } else {
        pausedByHiddenRef.current = false;
        // اگر ذراتی داریم یا حرکت جدیدی میاد، دوباره روشن میشه
        if (particles.length) ensureRunning();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    const draw = () => {
      // اگر تب hidden شد، اصلاً ادامه نده
      if (pausedByHiddenRef.current) return;

      // اگر 900ms هیچ حرکت نبود و ذره‌ها هم تقریباً خالی شدن => stop
      const now = performance.now();
      if (particles.length === 0 && now - lastMoveAt > 900) {
        stopRunning();
        return;
      }

      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${fade})`;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";
      ctx.shadowBlur = blur;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = (now - p.t) / lifeMs;

        if (age >= 1) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy + 0.03;

        const aa = p.a * (1 - age) * (1 - age);

        const [r, g, b] = p.c;
        ctx.shadowColor = `rgba(${r},${g},${b},0.7)`;
        ctx.fillStyle = `rgba(${r},${g},${b},${aa})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    // شروع فقط وقتی لازم شد (با اولین حرکت)
    // ensureRunning();  // ❌ عمداً نمی‌زنیم

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      stopRunning();
    };
  }, [
    disabledOnTouch,
    fade,
    lifeMs,
    spawn,
    spread,
    minR,
    maxR,
    blur,
    strength,
    color,
    colors,
    opacity,
    swirl,
    maskToPattern,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20"
      style={{
        opacity,
        mixBlendMode: "screen",
      }}
    />
  );
}

