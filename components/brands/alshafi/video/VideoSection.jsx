"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useEffect, useMemo, useRef, useState } from "react";
import SectionHeader from "@/components/products/SectionHeader";
import FadeInUp from "@/components/motion/FadeInUp";
import { MotionTitle, MotionSubtitle } from "@/components/ui/MotionText";
import AlshafiSectionHeading from "@/components/brands/alshafi/shared/AlshafiSectionHeading";
import styles from "./VideoSection.module.css";
import AlshafiSectionWatermark from "@/components/brands/alshafi/shared/AlshafiSectionWatermark";
/* ---------- helpers (همون خودت) ---------- */
function getYouTubeId(url) {
  try {
    const u = new URL(String(url).trim());

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "").split("?")[0] || null;
    }

    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;

      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/shorts/")[1]?.split("?")[0] || null;
      }

      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.split("/embed/")[1]?.split("?")[0] || null;
      }
    }

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
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
function getUid(v) {
  return (
    v?._id ||
    v?.slug?.current ||
    v?.youtubeUrl ||
    v?.videoUrl ||
    v?.fileUrl ||
    `${typeof v?.title === "string" ? v.title : "video"}-${v?.date || v?.publishDate || ""}`
  );
}
function GlassButton({ href, label }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold
      bg-[#111] text-[#c99a3a] border border-[#c99a3a]/35
      hover:bg-[#181818] hover:text-[#f3d98a] hover:border-[#c99a3a]/55
      transition shadow-sm active:scale-95"
    >
      {label}
      <span className="text-[#c99a3a] transition group-hover:text-[#f3d98a]">→</span>
    </a>
  );
}function VideoCard({ item, lang, onOpen }) {
  const uiFont = lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";
  const thumbUrl =
  item?.image ||
  item?.youtubeThumb ||
  item?.thumbnail?.asset?.url ||
  (item?.youtubeUrl ? getYouTubeThumb(item.youtubeUrl) : null);

  return (
    <motion.button
     type="button"
     onClick={() => {
  console.log(item);
  onOpen?.(item);
}}
    
     transition={{ duration: 0.35 }}
 className={`group block w-full relative overflow-hidden

rounded-[28px]
bg-[#111]
border border-[#c99a3a]/35
shadow-[0_28px_80px_-45px_rgba(201,154,58,0.35)]
  transition-all duration-300
  ${uiFont}`}
    >
           <div className="relative w-full aspect-[16/10] bg-zinc-200 overflow-hidden">
        {thumbUrl ? (
      <img
  src={thumbUrl}
  alt={item?.title || "Video"}
  className="
    absolute inset-0 w-full h-full object-cover
    scale-[1.12]
    transition-transform duration-700
    group-hover:scale-[1.18]
  "
  draggable="false"
/>
        ) : (
          <div className="absolute inset-0 bg-zinc-300" />
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />

        <div
  className="absolute bottom-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full
  bg-[#111]/85 backdrop-blur border border-[#c99a3a]/60 text-[#c99a3a]
  shadow-[0_10px_28px_-18px_rgba(201,154,58,0.75)]
  text-xs font-black"
>
  ▶ {lang === "ar" ? "تشغيل" : lang === "ku" ? "پێکردن" : "Play"}
</div>
      </div>

      <div className="p-5">
        <span className="alshafi-video-title-shine">
  {item?.title || "Video"}
</span>
      </div>
    </motion.button>
  );
}

function VideoPlayer({ item }) {
  if (!item) return null;

  const youtubeUrl =
    item?.youtubeUrl ||
    item?.resolvedVideoUrl ||
    item?.url ||
    "";

  const yt = youtubeUrl ? getYouTubeEmbed(youtubeUrl) : null;

  const uploadUrl =
    item?.fileUrl ||
    item?.videoUrl ||
    "";

  if (yt) {
    return (
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`${yt}?autoplay=1&rel=0`}
        title={item?.title || "Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  if (uploadUrl) {
    return (
      <video
        className="absolute inset-0 w-full h-full object-cover"
        controls
        autoPlay
        playsInline
        preload="metadata"
        src={uploadUrl}
        poster={item?.image || "/videos/placeholder.jpg"}
      />
    );
  }

  return (
    <div className="absolute inset-0 grid place-items-center text-white text-sm font-black">
      Invalid video source.
    </div>
  );
}

/* ---------- main ---------- */
export default function VideoSectionV1({ lang }) {
const { lang: activeLang } = useLanguage();
const currentLang = activeLang || lang;
  const uiFont = lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";
  const isRTL = lang === "ar" || lang === "ku";

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

    fetch(`/api/videos?brand=alshafi&lang=${currentLang}`)
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
  }, [currentLang]);

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
const videoCopy = {
  en: {
    eyebrow: "EXPLORE",
    titleTop: "ALSHAFI",
    titleBottom: "VIDEOS",
    desc: "Watch Alshafi official videos and highlights.",
    featureOne: "OFFICIAL VIDEOS",
    featureOneDesc: "Factory, products and brand moments.",
    featureTwo: "LATEST HIGHLIGHTS",
    featureTwoDesc: "Fresh updates and featured stories.",
  },

  ar: {
    eyebrow: "استكشف",
    titleTop: "الشافي",
    titleBottom: "الفيديوهات",
    desc: "شاهد فيديوهات الشافي الرسمية وأبرز اللقطات.",
    featureOne: "فيديوهات رسمية",
    featureOneDesc: "المصنع والمنتجات ولحظات العلامة التجارية.",
    featureTwo: "أحدث المقاطع",
    featureTwoDesc: "آخر التحديثات والقصص المميزة.",
  },

  ku: {
    eyebrow: "بگەڕێ",
    titleTop: "ئەشفی",
    titleBottom: "ڤیدیۆکان",
    desc: "تەماشای ڤیدیۆ فەرمییەکانی ئەشفی بکە.",
    featureOne: "ڤیدیۆ فەرمییەکان",
    featureOneDesc: "کارگە و بەرهەم و چیرۆکی براند.",
    featureTwo: "نوێترین ڤیدیۆکان",
    featureTwoDesc: "نوێترین هەواڵ و بابەتە تایبەتەکان.",
  },
}[lang];
 return (
    <section className={`${styles.videoSection} relative py-20 bg-transparent isolate ${uiFont}`} id="video">
    
      <div
  className="alshafi-video-layout alshafi-video-tablet-layout relative w-[min(1500px,96vw)] mx-auto px-[clamp(16px,3vw,56px)]"
  dir="ltr"
>
<AlshafiSectionWatermark
    type="youtube"
    className="alshafi-video-watermark"
  />
{/* ✅ Header درست (تیتر بزرگ + کمان بزرگ + ریپلی همه زبان‌ها) */}
            <div className="alshafi-video-heading-wrap">
  <FadeInUp>
    <AlshafiSectionHeading
      className="alshafi-video-heading"
  eyebrow={videoCopy.eyebrow}
  titleTop={videoCopy.titleTop}
  bottomTitle={videoCopy.titleBottom}
  desc={videoCopy.desc}
  featureOne={videoCopy.featureOne}
  featureOneDesc={videoCopy.featureOneDesc}
  featureTwo={videoCopy.featureTwo}
  featureTwoDesc={videoCopy.featureTwoDesc}
  animateLetters={lang === "en"}
/>
  </FadeInUp>
</div>       
 <motion.div
  initial={{ opacity: 0, y: 18 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.45 }}
  className="alshafi-video-content space-y-8"
>
          {/* Featured */}
          <div
  className="
   relative overflow-hidden rounded-[28px]
bg-[#111]
border border-[#c99a3a]/35
shadow-[0_28px_80px_-45px_rgba(201,154,58,0.35)]
    shadow-[0_22px_45px_-30px_rgba(0,0,0,0.7)]
    hover:shadow-[0_35px_70px_-45px_rgba(0,0,0,0.85)]
    transition
    max-w-[1280px] 2xl:max-w-[1500px] mx-auto
  "
>
            <div className="relative w-full aspect-video md:aspect-auto md:h-[360px] 2xl:md:h-[420px] bg-black overflow-hidden">
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
          </div>
<div
  className="
    grid grid-cols-1 md:grid-cols-3
    gap-4 md:gap-4 lg:gap-4 xl:gap-4
    max-w-[1280px] 2xl:max-w-[1500px]
    mx-auto
  "
>
  {list.map((v, i) => (
    <VideoCard key={getUid(v) || i} item={v} lang={lang} onOpen={setOpenItem} />
  ))}
</div>
<div
  className={`
    mt-10
    max-w-[1280px] 2xl:max-w-[1500px]
    mx-auto
    flex
    ${isRTL ? "justify-start" : "justify-end"}
    px-2 lg:px-0
  `}
>
  <GlassButton href={`/brand/alshafi/videos?lang=${lang}`} label={lang === "ar" ? "المزيد" : lang === "ku" ? "زیاتر" : "More"} />
</div>
        </motion.div>
      </div>

      <AnimatePresence>
        {openItem && (
          <motion.div
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
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

