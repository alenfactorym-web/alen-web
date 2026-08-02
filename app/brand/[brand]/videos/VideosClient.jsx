"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FadeInUp from "@/components/motion/FadeInUp";
import AlshafiSectionHeading from "@/components/brands/alshafi/shared/AlshafiSectionHeading";

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
    `${typeof v?.title === "string" ? v.title : "video"}-${v?.date || ""}`
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
      transition={{ duration: 0.35 }}
      className={`group block w-full relative overflow-hidden rounded-[28px]
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
            className="absolute inset-0 w-full h-full object-cover scale-[1.12] transition-transform duration-700 group-hover:scale-[1.18]"
            draggable="false"
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-300" />
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />

        <div
          className="absolute bottom-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full
          bg-white/10 backdrop-blur border border-white/15 text-white text-xs font-black"
        >
          ▶ {lang === "ar" ? "تشغيل" : lang === "ku" ? "پێکردن" : "Play"}
        </div>
      </div>

      <div className="p-5 text-left">
        <span className="alshafi-video-title-shine">
          {item?.title || "Video"}
        </span>
      </div>
    </motion.button>
  );
}

function VideoPlayer({ item }) {
  if (!item) return null;

  const youtubeUrl = item?.youtubeUrl || item?.resolvedVideoUrl || item?.url || "";
  const yt = youtubeUrl ? getYouTubeEmbed(youtubeUrl) : null;

  const uploadUrl = item?.fileUrl || item?.videoUrl || "";

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

export default function VideosClient({ list = [], lang = "en", page = 1, totalPages = 1 }) {
  const isRTL = lang === "ar" || lang === "ku";
  const uiFont = lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";

  const [openItem, setOpenItem] = useState(null);

  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

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
    <main
      className={`mini-site-alshafi relative min-h-screen bg-transparent overflow-hidden isolate ${uiFont}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <section
  id="video"
  className="alshafi-videos-page-section relative py-20 bg-transparent isolate"
>
        <div
          className="alshafi-video-layout relative w-[min(1500px,96vw)] mx-auto px-[clamp(16px,3vw,56px)]"
          dir="ltr"
        >
          <div className="alshafi-video-heading-wrap">
            <FadeInUp>
              <AlshafiSectionHeading
                className="alshafi-video-heading"
                eyebrow={lang === "ar" ? "استكشف" : lang === "ku" ? "بگەڕێ" : "EXPLORE"}
                titleTop={lang === "ar" ? "الشافي" : lang === "ku" ? "ئەشفی" : "ALSHAFI"}
                bottomTitle={lang === "ar" ? "الفيديوهات" : lang === "ku" ? "ڤیدیۆکان" : "VIDEOS"}
                desc={
                  lang === "ar"
                    ? "شاهد فيديوهات الشافي الرسمية وأبرز اللقطات."
                    : lang === "ku"
                    ? "تەماشای ڤیدیۆ فەرمییەکانی ئەشفی بکە."
                    : "Watch Alshafi official videos and highlights."
                }
                animateLetters={lang === "en"}
              />
            </FadeInUp>
          </div>

          <div className="alshafi-video-content space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4 lg:gap-4 xl:gap-4 max-w-[1280px] 2xl:max-w-[1500px] mx-auto">
              {stableList.map((v, i) => (
                <VideoCard
                  key={getUid(v) || i}
                  item={v}
                  lang={lang}
                  onOpen={setOpenItem}
                />
              ))}
            </div>

           <div
  className={`
    alshafi-videos-pagination
    mt-10
    max-w-[1280px] 2xl:max-w-[1500px]
    mx-auto
    px-2 lg:px-0
    ${uiFont}
  `}
>
             <Link
  href={`/brand/alshafi?lang=${lang}#video`}
  className="alshafi-videos-back rounded-full border border-[#c99a3a]/35 bg-[#111] px-6 py-3 text-sm font-bold text-[#c99a3a] hover:bg-[#181818] shadow-sm transition-transform active:scale-95"
>
  {lang === "ar" ? "رجوع" : lang === "ku" ? "گەڕانەوە" : "Back"}
</Link>

              <div className="alshafi-videos-pager flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={!canPrev}
                  className={`rounded-full border border-[#c99a3a]/35 px-6 py-3 text-sm font-bold shadow-sm ${
                    !canPrev
                      ? "bg-[#111]/40 text-[#c99a3a]/30 cursor-not-allowed"
                      : "bg-[#111] text-[#c99a3a] hover:bg-[#181818] active:scale-95 transition-all"
                  }`}
                >
                  {lang === "ar" ? "السابق" : lang === "ku" ? "پێشوو" : "Prev"}
                </button>

                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={!canNext}
                  className={`rounded-full border border-[#c99a3a]/35 px-6 py-3 text-sm font-bold shadow-sm ${
                    !canNext
                      ? "bg-[#111]/40 text-[#c99a3a]/30 cursor-not-allowed"
                      : "bg-[#111] text-[#c99a3a] hover:bg-[#181818] active:scale-95 transition-all"
                  }`}
                >
                  {lang === "ar" ? "التالي" : lang === "ku" ? "داهاتوو" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <div className="text-white font-black text-sm line-clamp-1">
                  {openItem?.title || "Video"}
                </div>

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
    </main>
  );
}