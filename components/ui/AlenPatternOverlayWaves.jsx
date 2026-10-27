"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// ALEN homepage: animated topographic contours, not fixed SVG paths.
// The field is a combination of gently moving soft surfaces.
const WIDTH = 1440;
const HEIGHT = 900;
const STEP = 8;
const COLS = Math.ceil(WIDTH / STEP);
const ROWS = Math.ceil(HEIGHT / STEP);
const LEVELS = [-0.48, -0.10, 0.33, 0.76];

export default function AlenPatternOverlayWaves() {
  const pathname = usePathname();
const showPattern =
  pathname === "/" ||
  pathname === "/about" ||
  pathname === "/contact" ||
  pathname === "/products" ||
  pathname.startsWith("/products/") ||
  pathname === "/videos" ||
  pathname.startsWith("/videos/") ||
  pathname === "/news" ||
  pathname.startsWith("/news/") ||
  pathname === "/brand/alen" ||
  pathname.startsWith("/brand/alen/");  pathname.startsWith("/news/"); 

const canvasRef = useRef(null);
const videoBackdropRef = useRef(null);
  useEffect(() => {
    if (!showPattern) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

   const largeMonitor = window.matchMedia(
  "(min-width: 1280px) and (min-height: 900px) and (orientation: landscape), " +
  "(min-width: 1367px) and (max-width: 1536px) and (max-height: 899px) and (orientation: landscape)"
);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const samples = new Float32Array((COLS + 1) * (ROWS + 1));

    const mouse = { x: WIDTH / 2, y: HEIGHT / 2, target: 0, strength: 0 };
    let raf = 0;
    let running = false;
    let lastPaint = -Infinity;
    let elapsed = 0;
    let previousTime = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      // Cap the device pixel ratio: the paths are deliberately very thin.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(canvas.width / WIDTH, 0, 0, canvas.height / HEIGHT, 0, 0);
    }

    function pointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) {
        mouse.target = 0;
        return;
      }
      mouse.x = ((event.clientX - rect.left) / rect.width) * WIDTH;
      mouse.y = ((event.clientY - rect.top) / rect.height) * HEIGHT;
      mouse.target = 1;
    }

    function pointerLeave() {
      mouse.target = 0;
    }

    // Continuous terrain: the moving peaks form growing and shrinking loops.
    function field(x, y, state) {
  const sx = x / WIDTH;
const sy = y / HEIGHT;

  const a = Math.sin(
    sx * 8.1 +
    state.ta +
    Math.sin(sy * 5.3 - state.tb) * 1.1
  );

  const b = Math.cos(
    sy * 7.5 -
    state.tc +
    Math.sin(sx * 5.6 + state.td)
  );

  const c = Math.sin(
    sx * 4.9 + sy * 4.5 + state.te
  );

  let value =
    a * state.flowA +
    b * state.flowB +
    c * 0.27;

  const ax = (sx - state.ax) / 0.15;
const ay = (sy - state.ay) / 0.23;

const bx = (sx - state.bx) / 0.19;
const by = (sy - state.by) / 0.21;

const cx = (sx - state.cx) / 0.20;
const cy = (sy - state.cy) / 0.27;

  value +=
    state.depthA *
    Math.exp(-state.sizeA * (ax * ax + ay * ay));

  value -=
    state.depthB *
    Math.exp(-state.sizeB * (bx * bx + by * by));

  value +=
    state.depthC *
    Math.exp(-state.sizeC * (cx * cx + cy * cy));

  if (mouse.strength > 0.001) {
    const dx = (x - mouse.x) / 195;
    const dy = (y - mouse.y) / 195;

    value -=
      mouse.strength *
      0.8 *
      Math.exp(-1.5 * (dx * dx + dy * dy));
  }

  return value;
}

 function draw(t) {
  t *= 2.2;

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // محاسبات مشترک فقط یک بار در هر فریم
  const sizeA = 1 + 0.11 * Math.sin(t * 0.19 + 1.3);
  const sizeB = 1 + 0.14 * Math.cos(t * 0.26 + 3.1);
  const sizeC = 1 + 0.10 * Math.sin(t * 0.33 + 5.2);

  const state = {
  ta: 0.32 * Math.sin(t * 0.24),
tb: 0.30 * Math.sin(t * 0.20 + 1.2),
tc: 0.26 * Math.sin(t * 0.22 + 2.4),
td: 0.28 * Math.sin(t * 0.18 + 0.7),
te: 0.24 * Math.sin(t * 0.26 + 1.8),

    flowA:
      0.56 * (1 + 0.08 * Math.sin(t * 0.17 + 0.6)),

    flowB:
      0.48 * (1 + 0.10 * Math.cos(t * 0.21 + 2.4)),

   ax: 0.28 + 0.15 * Math.sin(t * 0.32),
ay: 0.37 + 0.16 * Math.cos(t * 0.27),

bx: 0.73 + 0.14 * Math.cos(t * 0.29),
by: 0.63 + 0.16 * Math.sin(t * 0.35),

cx: 0.56 + 0.18 * Math.sin(t * 0.24 + 2),
cy: 0.48 + 0.19 * Math.cos(t * 0.31),

    depthA:
  0.92 * (1 + 0.65 * Math.sin(t * 0.42 + 0.4)),

depthB:
  0.83 * (1 + 0.70 * Math.sin(t * 0.36 + 2.1)),

depthC:
  0.66 * (1 + 0.75 * Math.cos(t * 0.47 + 4.2)),

    sizeA: 1.4 / (sizeA * sizeA),
    sizeB: 1.4 / (sizeB * sizeB),
    sizeC: 1.4 / (sizeC * sizeC),
  };

  for (let row = 0; row <= ROWS; row++) {
    const y = Math.min(row * STEP, HEIGHT);

    for (let col = 0; col <= COLS; col++) {
      const x = Math.min(col * STEP, WIDTH);

      samples[row * (COLS + 1) + col] =
        field(x, y, state);
    }
  }

      ctx.strokeStyle = "rgba(113, 111, 102, 0.20)";
ctx.lineWidth = 0.8;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.miterLimit = 2;

// Visible Video area in Canvas coordinates
const video = document.getElementById("video");
const canvasRect = canvas.getBoundingClientRect();
let videoTop = 0;
let videoBottom = 0;

if (video && canvasRect.height > 0) {
  const rect = video.getBoundingClientRect();
  const scaleY = HEIGHT / canvasRect.height;

  videoTop = Math.max(
    0,
    (rect.top - canvasRect.top) * scaleY
  );

  videoBottom = Math.min(
    HEIGHT,
    (rect.bottom - canvasRect.top) * scaleY
  );
}

// Marching squares: topology is allowed to change as the field moves.      // Consequently loops can emerge, grow, merge, shrink and disappear.
     for (const level of LEVELS) {
  const contourPath = new Path2D();
        for (let row = 0; row < ROWS; row++) {
          const y0 = row * STEP;
          const y1 = Math.min((row + 1) * STEP, HEIGHT);
          for (let col = 0; col < COLS; col++) {
            const x0 = col * STEP;
            const x1 = Math.min((col + 1) * STEP, WIDTH);
            const offset = row * (COLS + 1) + col;
            const v0 = samples[offset];
            const v1 = samples[offset + 1];
            const v2 = samples[offset + COLS + 2];
            const v3 = samples[offset + COLS + 1];
            const pts = [];
            const cross = (a, b, ax, ay, bx, by) => {
              if ((a < level) === (b < level)) return;
              const f = Math.max(0, Math.min(1, (level - a) / (b - a)));
              pts.push([ax + (bx - ax) * f, ay + (by - ay) * f]);
            };
            cross(v0, v1, x0, y0, x1, y0);
            cross(v1, v2, x1, y0, x1, y1);
            cross(v2, v3, x1, y1, x0, y1);
            cross(v3, v0, x0, y1, x0, y0);
            if (pts.length === 2) {
contourPath.moveTo(pts[0][0], pts[0][1]);
contourPath.lineTo(pts[1][0], pts[1][1]);
            } else if (pts.length === 4) {
              // Stable split for the ambiguous saddle case.
              const center = (v0 + v1 + v2 + v3) / 4;
              const pairs = center > level ? [[0, 3], [1, 2]] : [[0, 1], [2, 3]];
              for (const [i, j] of pairs) {
               contourPath.moveTo(pts[i][0], pts[i][1]);
contourPath.lineTo(pts[j][0], pts[j][1]);
              }
            }
          }
        }
       // Gray contours normally; gold throughout the Videos page.
ctx.strokeStyle =
  pathname === "/videos" || pathname.startsWith("/videos/")
    ? "rgba(201, 154, 58, 0.15)"
    : "rgba(113, 111, 102, 0.20)";

ctx.stroke(contourPath);

// Golden contours only inside Video
if (videoBottom > videoTop) {
  ctx.save();

  ctx.beginPath();
  ctx.rect(0, videoTop, WIDTH, videoBottom - videoTop);
  ctx.clip();

  ctx.strokeStyle = "rgba(201, 154, 58, 0.15)";
  ctx.stroke(contourPath);

  ctx.restore();
}
      }
    }

    function frame(now) {
      if (!running) return;
      raf = window.requestAnimationFrame(frame);
      if (now - lastPaint < 32) return; // ~30 fps: avoids competing with scroll animations.
      const dt = previousTime ? Math.min((now - previousTime) / 1000, 0.1) : 0;
      previousTime = now;
      lastPaint = now;
      elapsed += dt;
      const blend = 1 - Math.exp(-dt * 5);
      mouse.strength += (mouse.target - mouse.strength) * blend;
      draw(elapsed);
    }

    function update() {
      const shouldRun = largeMonitor.matches && !reducedMotion.matches && !document.hidden;
      if (shouldRun && !running) {
        resize();
        running = true;
        previousTime = 0;
        raf = window.requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        window.cancelAnimationFrame(raf);
        mouse.strength = 0;
        if (largeMonitor.matches) draw(elapsed); // Still image for reduced motion.
      } else if (!shouldRun && largeMonitor.matches) {
        resize();
        draw(elapsed);
      }
    }
// Keep the dark Video background behind the existing Canvas.
let backdropRaf = 0;

function updateVideoBackdrop() {
  const backdrop = videoBackdropRef.current;
  const video = document.getElementById("video");

  if (!backdrop) return;

  // Videos index: gray background behind the golden Canvas.
  if (pathname === "/videos") {
    backdrop.style.clipPath = largeMonitor.matches
      ? "inset(0 0 0 0)"
      : "inset(100% 0 0 0)";
    return;
  }

  if (!video || !largeMonitor.matches) {
    backdrop.style.clipPath = "inset(100% 0 0 0)";
    return;
  }
  const rect = video.getBoundingClientRect();
  const height = window.innerHeight;

  const top = Math.max(0, Math.min(height, rect.top));
  const bottom = Math.max(0, Math.min(height, rect.bottom));

  if (bottom <= top) {
    backdrop.style.clipPath = "inset(100% 0 0 0)";
    return;
  }

  backdrop.style.clipPath =
    `inset(${top}px 0 ${height - bottom}px 0)`;
}

function scheduleVideoBackdrop() {
  if (backdropRaf) return;

  backdropRaf = requestAnimationFrame(() => {
    backdropRaf = 0;
    updateVideoBackdrop();
  });
}

window.addEventListener("scroll", scheduleVideoBackdrop, { passive: true });
window.addEventListener("resize", scheduleVideoBackdrop, { passive: true });

scheduleVideoBackdrop();
    window.addEventListener("pointermove", pointerMove, { passive: true });
    document.addEventListener("pointerleave", pointerLeave);
    window.addEventListener("blur", pointerLeave);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", update);
    largeMonitor.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);
    update();

    return () => {
window.removeEventListener("scroll", scheduleVideoBackdrop);
window.removeEventListener("resize", scheduleVideoBackdrop);
cancelAnimationFrame(backdropRaf);
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", pointerMove);
      document.removeEventListener("pointerleave", pointerLeave);
      window.removeEventListener("blur", pointerLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", update);
      largeMonitor.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
        };
  }, [showPattern, pathname]);

  if (!showPattern) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] hidden overflow-hidden"
    >
     <style jsx>{`
  @media
    (min-width: 1280px) and (min-height: 900px) and (orientation: landscape),
    (min-width: 1367px) and (max-width: 1536px) and (max-height: 899px) and (orientation: landscape) {
    div { display: block; }
  }
`}</style>
     <canvas
  ref={canvasRef}
  className="absolute inset-0 h-full w-full"
/>
    </div>
  );
}
