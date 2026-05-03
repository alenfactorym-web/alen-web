"use client";
import { AnimatePresence, motion } from "framer-motion";
import { MotionTitle } from "@/components/ui/MotionText";
import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/* ------------------ YouTube helpers ------------------ */
function getYouTubeId(url) {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id || null;
    }

    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;

      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/shorts/")[1];
        return id || null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function getYouTubeThumb(url) {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function getYouTubeEmbed(url) {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
}

/* ------------------ Source detection ------------------ */
function pickPlayable(item) {
  const ytUrl = item?.youtubeUrl || null;
  const fileUrl = item?.videoUrl || null;

  if (item?.source === "youtube" && ytUrl) return { kind: "youtube", url: ytUrl };
  if (item?.source === "upload" && fileUrl) return { kind: "upload", url: fileUrl };

  if (fileUrl && getYouTubeId(fileUrl)) return { kind: "youtube", url: fileUrl };
  if (ytUrl && getYouTubeId(ytUrl)) return { kind: "youtube", url: ytUrl };
  if (fileUrl) return { kind: "upload", url: fileUrl };

  return { kind: "none", url: null };
}

function VideoPlayer({ item }) {
  if (!item) return null;
  const playable = pickPlayable(item);
  if (playable.kind === "none" || !playable.url) return null;

  if (playable.kind === "upload") {
    return (
      <video
        className="w-full h-full"
        controls
        playsInline
        preload="metadata"
        src={playable.url}
      />
    );
  }

  const embed = getYouTubeEmbed(playable.url);
  if (!embed) return null;

  return (
    <iframe
      className="w-full h-full"
      src={embed}
      title={item?.title || "Video"}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

function VideoCard({ item, lang, onOpen }) {
  const isRTL = lang === "ar" || lang === "ku";
  const uiFont = lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";
  const playable = pickPlayable(item);

 const thumbUrl =
  item?.image ||
  item?.youtubeThumb ||
  (playable.kind === "youtube" && playable.url ? getYouTubeThumb(playable.url) : null);

  return (
    <motion.button
      type="button"
      onClick={() => onOpen?.(item)}
     
 whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={`group block w-full relative overflow-hidden
        ${isRTL ? "text-right" : "text-left"}
        rounded-3xl bg-white/95 backdrop-blur-xl
        border border-black/10 shadow-[0_22px_45px_-30px_rgba(0,0,0,0.7)]
        hover:shadow-[0_35px_70px_-45px_rgba(0,0,0,0.85)]
        border-b-[8px] border-b-yellow-400 ${uiFont}`}
    >
      <span
        className="
          pointer-events-none absolute inset-0
          opacity-0 group-hover:opacity-100
          bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.7)_35%,transparent_70%)]
          bg-[length:200%_100%] bg-[position:200%_0]
          group-hover:bg-[position:-200%_0]
          transition-[background-position,opacity] duration-700 ease-out
        "
      />
      <div className="relative w-full aspect-[16/9] bg-zinc-200 overflow-hidden">
        {thumbUrl ? (
          <img
  src={thumbUrl}
  alt={item?.title || "Video"}
  className="absolute inset-0 w-full h-full object-cover scale-[1.12]"
  draggable="false"
/>
        ) : (
          <div className="absolute inset-0 bg-zinc-300" />
        )}

<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

        <div
          className={`absolute bottom-3 ${isRTL ? "right-3" : "left-3"} inline-flex items-center gap-2 px-3 py-1.5 rounded-full
          bg-white/10 backdrop-blur border border-white/15 text-white text-xs font-black`}
        >
          ▶ {lang === "ar" ? "تشغيل" : lang === "ku" ? "پێکردن" : "Play"}
        </div>
      </div>

      <div className="p-5">
        <div className="font-black text-zinc-500 text-[13px] leading-[1.15] h-[32px] overflow-hidden">
          {item?.title || "Video"}
        </div>
      </div>
    </motion.button>
  );
}

export default function VideosClient({ list = [], lang = "en", page = 1, totalPages = 1 }) {
  const isRTL = lang === "ar" || lang === "ku";
  const uiFont = lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";

  const [openItem, setOpenItem] = useState(null);
const closeBtnRef = useRef(null);
const lastActiveRef = useRef(null);

useEffect(() => {
  if (openItem) {
    lastActiveRef.current = document.activeElement;
    requestAnimationFrame(() => closeBtnRef.current?.focus?.());
    document.documentElement.style.overflow = "hidden";
  } else {
    document.documentElement.style.overflow = "";
    lastActiveRef.current?.focus?.();
  }

  return () => {
    document.documentElement.style.overflow = "";
  };
}, [openItem]);

useEffect(() => {
  const onKeyDown = (e) => {
    if (!openItem) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setOpenItem(null);
      return;
    }

    // Focus trap (Tab داخل مودال بچرخه)
    if (e.key === "Tab") {
      const root = document.getElementById("video-modal");
      if (!root) return;

      const focusables = root.querySelectorAll(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, [openItem]);

  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const t = {
    pageTitle: lang === "ar" ? "الفيديوهات" : lang === "ku" ? "ڤیدیۆکان" : "Videos",
    back: lang === "ar" ? "رجوع" : lang === "ku" ? "گەڕانەوە" : "Back",
    prev: lang === "ar" ? "السابق" : lang === "ku" ? "پێشوو" : "Prev",
    next: lang === "ar" ? "التالي" : lang === "ku" ? "داهاتوو" : "Next",
  };

  const stableList = useMemo(() => (Array.isArray(list) ? list : []), [list]);

  const goToPage = (nextPage) => {
    const p = Math.max(1, Math.min(totalPages, nextPage));
    const qs = new URLSearchParams(sp?.toString() || "");
    qs.set("lang", lang);
    qs.set("page", String(p));
    router.push(`${pathname}?${qs.toString()}`, { scroll: true });
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <main className={`relative min-h-screen bg-transparent overflow-hidden isolate ${uiFont}`} dir={isRTL ? "rtl" : "ltr"}>
      
<div className="relative w-[min(1500px,96vw)] mx-auto px-[clamp(16px,3vw,56px)] pt-28 pb-16">      
  {/* ✅ Title + Yellow Arc (centered like home) */}
        <div className="flex flex-col items-center text-center mb-10">
  <MotionTitle
    as="h1"
    className="text-5xl font-black text-zinc-500"
    reveal={lang === "en" ? "chars" : "block"}
    effect="mask"
    stagger={lang === "en" ? 0.045 : 0}
    delay={0.03}
    y={20}
    blur={8}
    amount={0.85}
    once={false}
    duration={0.95}
    resetKey={`videos-title-${lang}`}
  >
    {t.pageTitle}
  </MotionTitle>

  <motion.svg
    className="mt-3 text-yellow-500 max-w-[220px] mx-auto"
    width="220"
    height="20"
    viewBox="0 0 220 20"
    fill="none"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1 }}
    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
  >
    <motion.path
      d="M20 10 C 60 2, 160 2, 200 10"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    />
  </motion.svg>
</div>

        <div
  className="
    grid grid-cols-1 md:grid-cols-3
    gap-4 md:gap-4 lg:gap-4 xl:gap-4
    max-w-[1100px] 2xl:max-w-[1400px]
    mx-auto
  "
>
          {stableList.map((v, i) => (
            <VideoCard
              key={v?._id || i}
              item={v}
              lang={lang}
              onOpen={(item) => setOpenItem(item)}
            />
          ))}
        </div>

        {/* ✅ دکمه‌های پایین */}
        <div
  className={`
    mt-10
    max-w-[1100px] 2xl:max-w-[1400px]
    mx-auto
    flex items-center justify-between gap-3
    px-2 lg:px-0
    ${uiFont}
  `}
>
          <Link
            href={`/?lang=${lang}#video`}
            className="rounded-full border bg-white/90 px-6 py-3 text-sm font-bold text-zinc-500 hover:bg-white shadow-sm transition-transform active:scale-95"
          >
            {t.back}
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={!canPrev}
              className={`rounded-full border px-6 py-3 text-sm font-bold shadow-sm ${
                !canPrev
                  ? "bg-white/50 text-zinc-300 cursor-not-allowed"
                  : "bg-white/90 text-zinc-500 hover:bg-white active:scale-95 transition-all"
              }`}
            >
              {t.prev}
            </button>

            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={!canNext}
              className={`rounded-full border px-6 py-3 text-sm font-bold shadow-sm ${
                !canNext
                  ? "bg-white/50 text-zinc-300 cursor-not-allowed"
                  : "bg-white/90 text-zinc-500 hover:bg-white active:scale-95 transition-all"
              }`}
            >
              {t.next}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ مودال پلی مثل قبل */}
      <AnimatePresence>
        {openItem && (
         <motion.div
  className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
  role="dialog"
  aria-modal="true"
  aria-label={openItem?.title ? `Video: ${openItem.title}` : "Video dialog"}
  onMouseDown={(e) => {
    if (e.target === e.currentTarget) setOpenItem(null);
  }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
           <motion.div
  id="video-modal"
  className="w-[min(980px,96vw)] overflow-hidden rounded-3xl bg-black border border-white/10 shadow-2xl"
              initial={{ scale: 0.96, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 10, opacity: 0 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="text-white font-black text-sm line-clamp-1">
                  {openItem?.title || "Video"}
                </div>
                <button
  ref={closeBtnRef}
  onClick={() => setOpenItem(null)}
  aria-label={lang === "ar" ? "إغلاق" : lang === "ku" ? "داخستن" : "Close"}
  className="text-white/70 hover:text-white text-sm font-black px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 transition"
>
  ✕
</button>
              </div>

              <div className="relative w-full aspect-video bg-black">
                <VideoPlayer item={openItem} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

