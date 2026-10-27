"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import SectionHeader from "@/components/products/SectionHeader";
import FadeInUp from "@/components/motion/FadeInUp";
import { MotionTitle, MotionSubtitle } from "@/components/ui/MotionText";

/* ---------- helpers (همون خودت) ---------- */
function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "") || null;
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v") || null;
    return null;
  } catch {
    return null;
  }
}
function getYouTubeThumb(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
function getYouTubeEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}
function getUid(v) {
  return (
    v?._id ||
    v?.slug?.current ||
    v?.youtubeUrl ||
    v?.videoUrl ||
    `${typeof v?.title === "string" ? v.title : "video"}-${v?.publishDate || ""}`
  );
}

function GlassButton({ href, label }) {
  return (
    <a
      href={href}
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black
      bg-black/5 text-zinc-500 border border-black/10 backdrop-blur-md
      hover:bg-black/10 transition shadow-xl"

    >
      {label}
      <span className="text-zinc-500">→</span>
    </a>
  );
}


function VideoCard({ item, lang, onOpen }) {
  const uiFont = lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";
  const thumbUrl =
  item?.image ||
  item?.youtubeThumb ||
  item?.thumbnail?.asset?.url ||
  (item?.youtubeUrl ? getYouTubeThumb(item.youtubeUrl) : null);

  return (
    <motion.button
     type="button"
     onClick={() => onOpen?.(item)}
     whileHover={{ y: -6, scale: 1.02 }}
         whileTap={{ scale: 0.98 }}
     transition={{ duration: 0.35 }}
className={`group block w-full relative overflow-hidden
  rounded-3xl bg-white/95 backdrop-blur-xl
  border border-black/10
  border-b-[8px] border-b-yellow-400
  shadow-[0_18px_40px_-28px_rgba(0,0,0,0.38)]
  hover:shadow-[0_0_0_1px_rgba(250,204,21,0.4),0_30px_70px_-34px_rgba(0,0,0,0.5)]
  transition-all duration-300
  ${uiFont}`}

    >
           <div className="relative w-full aspect-[16/10] bg-zinc-200 overflow-hidden">
        {thumbUrl ? (
      <motion.img
  src={thumbUrl}
  alt={item?.title || "Video"}
  /* 🛠️ فقط اضافه شدن transform-gpu و data-visualsearch به انتهای خطوط بعدی */
  className="absolute inset-0 w-full h-full object-cover scale-[1.12] transform-gpu"
  whileHover={{ scale: 1.04 }}
  transition={{ duration: 0.35 }}
  draggable="false"
  data-visualsearch="false"
/>
        ) : (
          <div className="absolute inset-0 bg-zinc-300" />
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

        <div
          className="absolute bottom-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full
          bg-white/10 backdrop-blur border border-white/15 text-white text-xs font-black"
        >
          ▶ {lang === "ar" ? "تشغيل" : lang === "ku" ? "پێکردن" : "Play"}
        </div>
      </div>

     <div className="p-5">
  <div
  className={[
    "font-black text-zinc-500 text-[13px] leading-[1.15] h-[32px] overflow-hidden",
    lang === "ar" || lang === "ku" ? "text-right" : "text-left",
  ].join(" ")}
  >
    <span className="relative inline-block">
      {item?.title || "Video"}

      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          opacity-0 group-hover:opacity-100
          bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.7)_35%,transparent_70%)]
          bg-[length:200%_100%] bg-[position:200%_0]
          group-hover:bg-[position:-200%_0]
          bg-clip-text text-transparent
          transition-[background-position,opacity] duration-700 ease-out
        "
      >
        {item?.title || "Video"}
      </span>
    </span>
  </div>
</div>
    </motion.button>
  );
}

function VideoPlayer({ item }) {
  if (!item) return null;

  const uploadUrl = item?.videoUrl || item?.fileUrl || null;
  const yt = item?.youtubeUrl ? getYouTubeEmbed(item.youtubeUrl) : null;

  if (uploadUrl) {
    return (
      <video
        className="w-full h-full"
        controls
        playsInline
        preload="metadata"
        src={uploadUrl}
        poster={item?.image || "/videos/placeholder.jpg"}
      />
    );
  }

  if (yt) {
    return (
      <iframe
        className="w-full h-full"
        src={yt}
        title={item?.title || "Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return null;
}

// ALEN — Scattered Video Card
function CinematicVideoCard({
  item,
  index,
  lang,
  onOpen,
  progress,
  enabled,
}) {
const timings = [
  [0.00, 0.48],
  [0.02, 0.53],
  [0.01, 0.56],
];
 const startX = [-160, 110, 230];
  const startY = [-100, 140, -65];

  const [start, end] = timings[index];

  const x = useTransform(
    progress,
    [start, end],
    [startX[index], 0]
  );

  const y = useTransform(
    progress,
    [start, end],
    [startY[index], 0]
  );

  const scale = useTransform(
    progress,
    [start, end],
    [0.90, 1]
  );

 const springConfig = {
  stiffness: 180,
  damping: 30,
  mass: 0.8,
};

  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);
  const smoothScale = useSpring(scale, springConfig);

  return (
    <motion.div
      className="w-full min-w-0"
style={{
  x: enabled ? smoothX : 0,
  y: enabled ? smoothY : 0,
  scale: enabled ? smoothScale : 1,
}}    >
      <VideoCard
        item={item}
        lang={lang}
        onOpen={onOpen}
      />
    </motion.div>
  );
}


/* ---------- main ---------- */
export default function VideoSectionV1({ lang }) {
  const pathname = usePathname();
  const uiFont = lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";  const isRTL = lang === "ar" || lang === "ku";

  // ✅ EN chars | AR/KU block
  const revealMode = lang === "en" ? "chars" : "block";

  // ✅ کندتر مثل چیزی که گفتی
  const titleStagger = lang === "en" ? 0.085 : 0;
  const subStagger = lang === "en" ? 0.045 : 0;

  // ✅ برای اینکه هم کمان هم متن با تغییر زبان/اسکرول ریپلی بشن
  const [resetKeyN, setResetKeyN] = useState(0);
  useEffect(() => setResetKeyN((k) => k + 1), [lang]);
  const resetKey = `video-${lang}-${resetKeyN}`;

  const featuredRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openItem, setOpenItem] = useState(null);
// ALEN — Cinematic Video Scroll
const videoSectionRef = useRef(null);
const videoSceneRef = useRef(null);
const videoViewportRef = useRef(null);
const videoContentRef = useRef(null);
const [laptopOverflow, setLaptopOverflow] = useState(0);
const reduceMotion = useReducedMotion();
const [isLargeMonitor, setIsLargeMonitor] = useState(false);
const [isLaptop, setIsLaptop] = useState(false);
const [returnToVideo, setReturnToVideo] = useState(false);

useEffect(() => {
  const handlePageShow = () => {
    if (window.sessionStorage.getItem("alen-video-back") !== "1") return;

    window.sessionStorage.removeItem("alen-video-back");
    setReturnToVideo(true);
  };

  handlePageShow();

  window.addEventListener("pageshow", handlePageShow);

  return () => {
    window.removeEventListener("pageshow", handlePageShow);
  };
}, []);
useEffect(() => {
  const large = window.matchMedia(    "(min-width: 1280px) and (min-height: 900px) and (orientation: landscape)"
  );

  const laptop = window.matchMedia(
    "(min-width: 1367px) and (max-width: 1536px) and (max-height: 899px) and (orientation: landscape)"
  );

  const update = () => {
    setIsLargeMonitor(large.matches);
    setIsLaptop(laptop.matches);
  };

  update();

  large.addEventListener("change", update);
  laptop.addEventListener("change", update);

  return () => {
    large.removeEventListener("change", update);
    laptop.removeEventListener("change", update);
  };
}, []);

const cinematicVideo =
  pathname === "/" &&
  isLargeMonitor &&
  !reduceMotion &&
  !returnToVideo;

useEffect(() => {
  if (!isLaptop || !cinematicVideo) return;

  const viewport = videoViewportRef.current;
  const content = videoContentRef.current;

  if (!viewport || !content) return;

  const measure = () => {
    setLaptopOverflow(
      Math.max(0, content.scrollHeight - viewport.clientHeight)
    );
  };

  const observer = new ResizeObserver(measure);

  observer.observe(viewport);
  observer.observe(content);

  measure();

  return () => observer.disconnect();
}, [isLaptop, cinematicVideo, loading, data]);

const { scrollYProgress } = useScroll({
  target: videoSceneRef,
  offset: ["start 55%", "end end"],
});

const laptopVideoY = useTransform(
  scrollYProgress,
  [0, 0.35, 0.85, 1],
  [0, 0, -laptopOverflow, -laptopOverflow]
);// Featured — Previous Stable Motion
const featuredScale = useTransform(
  scrollYProgress,
  [0, 0.18, 0.50, 1],
  [1.15, 1.15, 1, 1]
);
const featuredY = useTransform(
  scrollYProgress,
  [0, 0.32, 0.50, 1],
  ["20vh", "0vh", "0vh", "0vh"]
);const smoothFeaturedScale = useSpring(featuredScale, {
  stiffness: 65,
  damping: 30,
  mass: 1.5,
});

const smoothFeaturedY = useSpring(featuredY, {
  stiffness: 65,
  damping: 30,
  mass: 1.5,
});
// کارت‌های پایین — حرکت مستقل
useEffect(() => {
  if (!openItem) return;

  const scrollY = window.scrollY;

  const originalHtmlOverflow = document.documentElement.style.overflow;
  const originalBodyOverflow = document.body.style.overflow;
  const originalBodyPosition = document.body.style.position;
  const originalBodyTop = document.body.style.top;
  const originalBodyWidth = document.body.style.width;

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";

  return () => {
    document.documentElement.style.overflow = originalHtmlOverflow;
    document.body.style.overflow = originalBodyOverflow;
    document.body.style.position = originalBodyPosition;
    document.body.style.top = originalBodyTop;
    document.body.style.width = originalBodyWidth;

    window.scrollTo(0, scrollY);
  };
}, [openItem]);
  useEffect(() => {
    let ignore = false;
    setLoading(true);

    fetch(`/api/videos?lang=${lang}&brand=alen`)
      .then((r) => r.json())
      .then((json) => {
        if (!ignore) setData(json);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [lang]);

  const featured = data?.featured || null;

  const list = useMemo(() => {
    const arr = Array.isArray(data?.list) ? data.list : [];
    const seen = new Set();
    return arr
      .filter((v) => {
        const uid = getUid(v);
        if (!uid || seen.has(uid)) return false;
        seen.add(uid);
        return true;
      })
      .slice(0, 3);
  }, [data]);

  const featuredIsUpload = featured?.source === "upload" && featured?.videoUrl;
  const featuredYouTubeEmbed = featured?.youtubeUrl ? getYouTubeEmbed(featured.youtubeUrl) : null;

return (
 <section
  ref={videoSectionRef}
 className={`relative ${uiFont} ${
  cinematicVideo
    ? "py-20"
    : isLaptop
      ? "pt-20 pb-60"
      : "py-60 [@media(max-width:1024px)_and_(orientation:portrait)]:!pt-60"
}`}
>
    <div
  ref={videoSceneRef}
  className={
  cinematicVideo
    ? isLaptop
      ? "relative h-[230vh]"
      : "relative h-[210vh]"
    : "relative"
}
>
     <div
  ref={videoViewportRef}
  className={
  cinematicVideo
  ? isLaptop
    ? "sticky top-[70px] h-[calc(100vh-70px)]"
    : "sticky top-[70px] h-[calc(100vh-70px)]"
  : ""
  }
>
  <motion.div
    ref={videoContentRef}
    style={{ y: isLaptop ? laptopVideoY : 0 }}
    className={`relative mx-auto px-[clamp(16px,3vw,56px)] ${
      cinematicVideo
        ? "w-[min(1880px,96vw)]"
        : "w-[min(1500px,96vw)]"
    }`}
    dir="ltr"
  >
{/* ✅ Header درست (تیتر بزرگ + کمان بزرگ + ریپلی همه زبان‌ها) */}
             <FadeInUp>
       <SectionHeader
  resetKey={resetKey}
  titleClassName="text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-500"
  arcClassName="mx-auto mt-2 w-[240px] h-[24px]"
  subtitleClassName="mt-2 text-zinc-500 max-w-2xl mx-auto text-lg md:text-xl"
  title={
    <MotionTitle
      as="span"
      className="inline-block"
      reveal={revealMode}
      effect="mask"
      stagger={lang === "en" ? 0.045 : 0}
      delay={0.03}
      y={20}
      blur={8}
      amount={0.85}
      once={false}
      duration={0.95}
      resetKey={`t-${resetKey}`}
    >
      {lang === "ar" ? "الفيديو" : lang === "ku" ? "ڤیدیۆ" : "Video"}
    </MotionTitle>
  }
  subtitle={
    <MotionSubtitle
      as="span"
      className="inline-block"
      reveal={revealMode}
      effect="mask"
      stagger={0.04}
      delay={0.03}
      y={16}
      blur={6}
      amount={0.85}
      once={false}
      duration={0.2}
      resetKey={`s-${resetKey}`}
    >
      {lang === "ar"
        ? "شاهد أحدث فيديوهاتنا"
        : lang === "ku"
        ? "بینەری نوێترین ڤیدیۆکانمان بن"
        : "Watch our latest videos and highlights."}
    </MotionSubtitle>
  }
/>
</FadeInUp>
    <motion.div
  initial={{ opacity: 0, y: 18 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.45 }}
  className="space-y-8"
>
         {/* Featured */}
<motion.div
style={{
  scale: cinematicVideo && !returnToVideo ? smoothFeaturedScale : 1,
  y: cinematicVideo && !returnToVideo ? smoothFeaturedY : 0,
  transformOrigin: "center center",
}}  className="
    alen-video-featured
    relative overflow-hidden rounded-3xl
    bg-white/95 backdrop-blur-xl
    border border-black/10
    shadow-[0_22px_45px_-30px_rgba(0,0,0,0.7)]
    hover:shadow-[0_35px_70px_-45px_rgba(0,0,0,0.85)]
    transition
    max-w-[1100px] 2xl:max-w-[1400px] mx-auto
  "

>
            <div className="alen-video-featured-frame relative w-full aspect-video md:aspect-auto md:h-[360px] 2xl:md:h-[540px] bg-black overflow-hidden">
              {loading ? (
                <div className="absolute inset-0 grid place-items-center text-zinc-500 text-sm font-black">
                  Loading...
                </div>
              ) : !featured ? (
                <div className="absolute inset-0 grid place-items-center text-zinc-500 text-sm font-black">
                  {lang === "ar"
                    ? "لا يوجد فيديو مميز بعد"
                    : lang === "ku"
                    ? "هیچ ڤیدیۆیەکی دیاریکراو نییە"
                    : "No featured video yet."}
                </div>
              ) : featuredIsUpload ? (
              <video
  ref={featuredRef}
  className="absolute inset-0 w-full h-full object-cover"
  controls
  playsInline
  preload="auto"
  src={featured.videoUrl || featured.fileUrl}
  poster={featured?.image || "/alen-plan-3d.jpg"}
  onEnded={() => {
    const v = featuredRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    v.load();
  }}
/>
              ) : featuredYouTubeEmbed ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={featuredYouTubeEmbed}
                  title={featured?.title || "Featured Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : featured?.videoUrl || featured?.fileUrl ? (
  <video
    ref={featuredRef}
    className="absolute inset-0 w-full h-full object-cover"
    controls
    playsInline
    preload="metadata"
    src={featured.videoUrl || featured.fileUrl}
    poster={featured?.image || "/alen-plan-3d.jpg"}
    onEnded={() => {
      const v = featuredRef.current;
      if (!v) return;
      v.pause();
      v.currentTime = 0;
      v.load();
    }}
  />
) : (
  <div className="absolute inset-0 grid place-items-center text-zinc-500 text-sm font-black">
    Invalid video source.
  </div>
)}
            </div>
          </motion.div>
<div
  className="
   alen-video-grid grid grid-cols-1 md:grid-cols-3
gap-4 md:gap-4 lg:gap-4 xl:gap-4
max-w-[1100px] 2xl:max-w-[1700px]
mx-auto
max-md:w-[88%]
  "
>
  {list.map((v, i) => (
    <CinematicVideoCard
      key={getUid(v) || i}
      item={v}
      index={i}
      lang={lang}
      onOpen={setOpenItem}
            progress={scrollYProgress}
      enabled={cinematicVideo && !returnToVideo}
    />
  ))}
</div>
<div
  className={`
    alen-video-more-wrap
    mt-10
    max-w-[1100px] 2xl:max-w-[1400px]
    mx-auto
    flex
    ${isRTL ? "justify-start" : "justify-end"}
    px-2 lg:px-0
  `}
>            <GlassButton href={`/videos?lang=${lang}`} label={lang === "ar" ? "المزيد" : lang === "ku" ? "زیاتر" : "More"} />
                   </div>
              </motion.div>
        </motion.div>
      </div>
      </div>

      <AnimatePresence>
        {openItem && (
          <motion.div
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center pt-28 pb-4 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpenItem(null);
            }}
          >
            <motion.div
              className="w-[min(980px,96vw)] overflow-hidden rounded-3xl bg-black border border-white/10 shadow-2xl"
              initial={{ scale: 0.96, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 10, opacity: 0 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="text-white font-black text-sm line-clamp-1">{openItem?.title || "Video"}</div>
                <button
                  onClick={() => setOpenItem(null)}
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
    </section>
  );
}

