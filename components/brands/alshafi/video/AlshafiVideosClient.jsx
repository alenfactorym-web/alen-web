"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FadeInUp from "@/components/motion/FadeInUp";
import AlshafiSectionHeading from "@/components/brands/alshafi/shared/AlshafiSectionHeading";
import styles from "./AlshafiVideosClient.module.css";
import AlshafiSectionWatermark from "@/components/brands/alshafi/shared/AlshafiSectionWatermark";

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
      className={`${styles.card} ${uiFont}`}
    >
      <div className={styles.cardImage}>
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={item?.title || "Video"}
            className={styles.cardImg}
            draggable="false"
          />
        ) : (
          <div className={styles.cardFallback} />
        )}

        <div className={styles.cardOverlay} />

        <div className={`${styles.playBadge} alshafi-video-play-badge`}>
          ▶ {lang === "ar" ? "تشغيل" : lang === "ku" ? "پێکردن" : "Play"}
        </div>
      </div>

      <div className={styles.cardBody}>
        <span className={`${styles.titleShine} alshafi-video-title-shine`}>
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
        className={styles.playerFrame}
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
        className={styles.playerFrame}
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
    <div className={styles.invalidVideo}>
      Invalid video source.
    </div>
  );
}

export default function AlshafiVideosClient({
  list = [],
  lang = "en",
  page = 1,
  totalPages = 1,
}) {
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

    router.push(`${pathname}?${qs.toString()}`, { scroll: false });

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <main
      className={`${styles.videosPage} mini-site-alshafi ${uiFont}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <section id="video" className={styles.section}>
       <div className={styles.layout} dir="ltr">
  <AlshafiSectionWatermark
    type="youtube"
    className="alshafi-video-watermark"
  />

  <div className={styles.headingWrap}>
            <FadeInUp>
            <AlshafiSectionHeading
  className={`${styles.heading} alshafi-video-heading`}
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
  featureOne={
    lang === "ar" ? "جودة ممتازة" : lang === "ku" ? "کوالێتی بەرز" : "PREMIUM QUALITY"
  }
  featureOneDesc={
    lang === "ar"
      ? "مكونات مختارة بعناية."
      : lang === "ku"
      ? "پێکهاتەکان بە وردی هەڵبژێردراون."
      : "Carefully selected ingredients"
  }
  featureTwo={
    lang === "ar" ? "طبيعي وأصيل" : lang === "ku" ? "سروشتی و ڕەسەن" : "NATURAL & AUTHENTIC"
  }
  featureTwoDesc={
    lang === "ar"
      ? "مصنوع لمذاق استثنائي."
      : lang === "ku"
      ? "دروستکراو بۆ تامێکی تایبەت."
      : "Crafted for exceptional taste"
  }
  animateLetters={lang === "en"}
/>
            </FadeInUp>
          </div>

          <div className={styles.content}>
            <div className={styles.grid}>
              {stableList.map((v, i) => (
                <VideoCard
                  key={getUid(v) || i}
                  item={v}
                  lang={lang}
                  onOpen={setOpenItem}
                />
              ))}
            </div>

            <div className={`${styles.pagination} ${uiFont}`}>
              <Link
                href={`/brand/alshafi?lang=${lang}#video`}
                className={`${styles.back} rounded-full border border-[#c99a3a]/35 bg-[#111] px-6 py-3 text-sm font-bold text-[#c99a3a] hover:bg-[#181818] shadow-sm transition-transform active:scale-95`}
              >
                {lang === "ar" ? "رجوع" : lang === "ku" ? "گەڕانەوە" : "Back"}
              </Link>

              <div className={styles.pager}>
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={!canPrev}
                  className={`${styles.pageButton} ${
                    !canPrev ? styles.pageButtonDisabled : styles.pageButtonActive
                  }`}
                >
                  {lang === "ar" ? "السابق" : lang === "ku" ? "پێشوو" : "Prev"}
                </button>

                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={!canNext}
                  className={`${styles.pageButton} ${
                    !canNext ? styles.pageButtonDisabled : styles.pageButtonActive
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
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpenItem(null);
            }}
          >
            <motion.div
              className={styles.modalBox}
              initial={{ scale: 0.96, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 10, opacity: 0 }}
            >
              <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>
                  {openItem?.title || "Video"}
                </div>

                <button
                  onClick={() => setOpenItem(null)}
                  className={styles.closeButton}
                >
                  ✕
                </button>
              </div>

              <div className={styles.modalVideo}>
                <VideoPlayer item={openItem} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}