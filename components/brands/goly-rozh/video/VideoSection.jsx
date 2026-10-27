"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

import GolyRozhReveal from "../shared/GolyRozhReveal";
import GolyRozhSectionHeading from "../shared/GolyRozhSectionHeading";
import HeroCurve from "../HeroCurve";

import styles from "./VideoSection.module.css";
const COPY = {
  en: {
    eyebrow: "EXPLORE",
    titleTop: "GOLY ROZH",
    titleBottom: "VIDEOS",
    desc: "Watch official Goly Rozh videos and discover our latest highlights.",
    play: "Play",
    loading: "Loading...",
    emptyFeatured: "No featured video yet.",
    emptyList: "No videos available yet.",
    invalid: "Invalid video source.",
    close: "Close",
      more: "More",

  },

  ar: {
    eyebrow: "استكشف",
    titleTop: "GOLY ROZH",
    titleBottom: "الفيديوهات",
    desc: "شاهد فيديوهات Goly Rozh الرسمية واكتشف أحدث المقاطع.",
    play: "تشغيل",
    loading: "جارٍ التحميل...",
    emptyFeatured: "لا يوجد فيديو مميز حالياً.",
    emptyList: "لا توجد فيديوهات حالياً.",
    invalid: "مصدر الفيديو غير صالح.",
    close: "إغلاق",
  more: "المزيد",

  },

  ku: {
    eyebrow: "بگەڕێ",
    titleTop: "گولی ڕۆژ",
    titleBottom: "ڤیدیۆکان",
    desc: "تەماشای ڤیدیۆ فەرمییەکانی گولی ڕۆژ و نوێترین ساتەکان بکە.",
    play: "پێکردن",
    loading: "بارکردن...",
    emptyFeatured: "هێشتا هیچ ڤیدیۆیەکی دیاریکراو نییە.",
    emptyList: "هێشتا هیچ ڤیدیۆیەک بەردەست نییە.",
    invalid: "سەرچاوەی ڤیدیۆ دروست نییە.",
    close: "داخستن",
  more: "زیاتر",

  },
};

function getYouTubeId(url) {
  try {
    const value = String(url || "").trim();

    if (!value) return null;

    const parsed = new URL(value);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "").split("?")[0] || null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");

      if (id) return id;

      if (parsed.pathname.startsWith("/shorts/")) {
        return (
          parsed.pathname.split("/shorts/")[1]?.split("?")[0] ||
          null
        );
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return (
          parsed.pathname.split("/embed/")[1]?.split("?")[0] ||
          null
        );
      }
    }

    return null;
  } catch {
    return null;
  }
}

function getYouTubeThumb(url) {
  const id = getYouTubeId(url);

  return id
    ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    : null;
}

function getYouTubeEmbed(url) {
  const id = getYouTubeId(url);

  return id
    ? `https://www.youtube.com/embed/${id}`
    : null;
}

function getUid(item) {
  return (
    item?._id ||
    item?.slug?.current ||
    item?.youtubeUrl ||
    item?.videoUrl ||
    item?.fileUrl ||
    `${item?.title || "video"}-${
      item?.date || item?.publishDate || ""
    }`
  );
}

function getPoster(item) {
  return (
    item?.image ||
    item?.youtubeThumb ||
    item?.thumbnail?.asset?.url ||
    (item?.youtubeUrl
      ? getYouTubeThumb(item.youtubeUrl)
      : null)
  );
}

function VideoPlayer({ item, invalidText }) {
  if (!item) return null;

  const uploadUrl =
    item?.fileUrl ||
    item?.videoUrl ||
    "";

  const youtubeUrl =
    item?.youtubeUrl ||
    item?.resolvedVideoUrl ||
    item?.url ||
    "";

  const youtubeEmbed = youtubeUrl
    ? getYouTubeEmbed(youtubeUrl)
    : null;

  if (uploadUrl) {
    return (
      <video
        className={styles.modalPlayer}
        controls
        autoPlay
        playsInline
        preload="metadata"
        src={uploadUrl}
        poster={getPoster(item) || ""}
      />
    );
  }

  if (youtubeEmbed) {
    return (
      <iframe
        className={styles.modalPlayer}
        src={`${youtubeEmbed}?autoplay=1&rel=0`}
        title={item?.title || "Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <div className={styles.invalidVideo}>
      {invalidText}
    </div>
  );
}

function VideoCard({
  item,
  currentLang,
  copy,
  onOpen,
}) {
  const poster = getPoster(item);

  const titleFont =
    currentLang === "ar"
      ? "font-ar-title"
      : currentLang === "ku"
        ? "ku-title"
        : "";

  return (
    <button
  type="button"
  className={styles.videoCard}
  onClick={() => onOpen(item)}
>
      <div className={styles.cardShell}>
        <div className={styles.cardImageWrap}>
          {poster ? (
            <img
              src={poster}
              alt={item?.title || "Video"}
              className={styles.cardImage}
              draggable="false"
            />
          ) : (
            <div
              className={styles.cardImageFallback}
            />
          )}

          <div className={styles.cardShade} />

          <span
            className={`${styles.playChip} ${titleFont}`}
          >
            <span
              className={styles.playIcon}
              aria-hidden="true"
            >
              ▶
            </span>

            {copy.play}
          </span>
        </div>

        <div className={styles.cardBody}>
          <span
            className={`${styles.cardTitle} ${titleFont}`}
            dir={
              currentLang === "en"
                ? "ltr"
                : "rtl"
            }
          >
            {item?.title || "Video"}
          </span>

          <span
            className={styles.cardArrow}
            aria-hidden="true"
          >
            →
          </span>
        </div>
      </div>
    </button>
  );
}

export default function GolyRozhVideoSection({
  lang = "en",
}) {
  const { lang: activeLang } = useLanguage();

  const currentLang = ["en", "ar", "ku"].includes(
    activeLang,
  )
    ? activeLang
    : ["en", "ar", "ku"].includes(lang)
      ? lang
      : "en";

  const copy = COPY[currentLang];

  const isRTL =
    currentLang === "ar" ||
    currentLang === "ku";

  const featuredRef = useRef(null);
const hasLoadedVideosRef = useRef(false);

const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [openItem, setOpenItem] = useState(null);

  useEffect(() => {
  let ignore = false;

  const isInitialLoad = !hasLoadedVideosRef.current;

  if (isInitialLoad) {
    setLoading(true);
  }

  fetch(
    `/api/videos?lang=${currentLang}&brand=goly-rozh`,
  )
    .then((response) => response.json())
    .then((json) => {
      if (!ignore) {
        setData(json);
        hasLoadedVideosRef.current = true;
      }
    })
    .catch(() => {
      if (!ignore && isInitialLoad) {
        setData(null);
      }
    })
    .finally(() => {
      if (!ignore && isInitialLoad) {
        setLoading(false);
      }
    });

  return () => {
    ignore = true;
  };
}, [currentLang]);

  useEffect(() => {
  if (!openItem) return;

  const html =
    document.documentElement;

  const body =
    document.body;

  const originalHtmlOverflow =
    html.style.overflow;

  const originalBodyOverflow =
    body.style.overflow;

  const originalScrollbarGutter =
    html.style.scrollbarGutter;

  html.style.scrollbarGutter =
    "stable";

  html.style.overflow =
    "hidden";

  body.style.overflow =
    "hidden";

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setOpenItem(null);
    }
  };

  window.addEventListener(
    "keydown",
    handleKeyDown,
  );

  return () => {
    window.removeEventListener(
      "keydown",
      handleKeyDown,
    );

    html.style.overflow =
      originalHtmlOverflow;

    body.style.overflow =
      originalBodyOverflow;

    html.style.scrollbarGutter =
      originalScrollbarGutter;
  };
}, [openItem]);

  const featured =
    data?.featured ||
    null;

  const list = useMemo(() => {
    const source = Array.isArray(data?.list)
      ? data.list
      : [];

    const seen = new Set();

    return source
      .filter((item) => {
        const uid = getUid(item);

        if (!uid || seen.has(uid)) {
          return false;
        }

        seen.add(uid);

        return true;
      })
      .slice(0, 3);
  }, [data]);

  const featuredUpload =
    featured?.videoUrl ||
    featured?.fileUrl ||
    "";

  const featuredIsUpload =
    featured?.source === "upload" &&
    Boolean(featuredUpload);

  const featuredYoutubeUrl =
    featured?.youtubeUrl ||
    featured?.resolvedVideoUrl ||
    featured?.url ||
    "";

  const featuredYoutube =
    featuredYoutubeUrl
      ? getYouTubeEmbed(featuredYoutubeUrl)
      : null;

  return (
    <section
      id="video"
      className={styles.videoSection}
      dir={isRTL ? "rtl" : "ltr"}
      data-lang={currentLang}
    >
      <div className={styles.inner}>
        <GolyRozhReveal
          key={currentLang}
          className={styles.headingWrap}
          replayKey={currentLang}
        >
          <GolyRozhSectionHeading
            eyebrow={copy.eyebrow}
            titleTop={copy.titleTop}
            titleBottom={copy.titleBottom}
            desc={copy.desc}
            lang={currentLang}
            className={styles.heading}
          />
        </GolyRozhReveal>

       <div
  className={styles.content}
  dir="ltr"
>
          <div className={styles.featuredCard}>
            <div className={styles.featuredMedia}>
              {loading ? (
                <div
                  className={styles.stateMessage}
                >
                  {copy.loading}
                </div>
              ) : !featured ? (
                <div
                  className={styles.stateMessage}
                >
                  {copy.emptyFeatured}
                </div>
              ) : featuredIsUpload ? (
                <video
                  ref={featuredRef}
                  className={styles.featuredPlayer}
                  controls
                  playsInline
                  preload="auto"
                  src={featuredUpload}
                  poster={
                    getPoster(featured) || ""
                  }
                  onEnded={() => {
                    const video =
                      featuredRef.current;

                    if (!video) return;

                    video.pause();
                    video.currentTime = 0;
                    video.load();
                  }}
                />
              ) : featuredYoutube ? (
                <iframe
                  className={styles.featuredPlayer}
                  src={featuredYoutube}
                  title={
                    featured?.title ||
                    "Featured Video"
                  }
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : featuredUpload ? (
                <video
                  ref={featuredRef}
                  className={styles.featuredPlayer}
                  controls
                  playsInline
                  preload="metadata"
                  src={featuredUpload}
                  poster={
                    getPoster(featured) || ""
                  }
                  onEnded={() => {
                    const video =
                      featuredRef.current;

                    if (!video) return;

                    video.pause();
                    video.currentTime = 0;
                    video.load();
                  }}
                />
              ) : (
                <div
                  className={styles.stateMessage}
                >
                  {copy.invalid}
                </div>
              )}
            </div>
          </div>

          {!loading && list.length > 0 ? (
            <div className={styles.videoGrid}>
              {list.map((item, index) => (
                <VideoCard
                  key={
                    getUid(item) ||
                    index
                  }
                  item={item}
                  currentLang={currentLang}
                  copy={copy}
                  onOpen={setOpenItem}
                />
              ))}
            </div>
          ) : null}
{!loading && list.length > 0 ? (
  <div className={styles.moreWrap}>
    <a
      href={`/brand/goly-rozh/videos?lang=${currentLang}`}
      className={styles.moreButton}
    >
      <span>{copy.more}</span>
      <span
        className={styles.moreArrow}
        aria-hidden="true"
      >
        →
      </span>
    </a>
  </div>
) : null}

          {!loading &&
          !featured &&
          list.length === 0 ? (
            <div className={styles.emptyList}>
              {copy.emptyList}
            </div>
          ) : null}
               </div>
      </div>

      <HeroCurve color="#b01a24" />

      <AnimatePresence>
        {openItem && (
          <motion.div
            className={styles.modalBackdrop}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setOpenItem(null);
              }
            }}
          >
            <motion.div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-label={
                openItem?.title ||
                "Video"
              }
              initial={{
                scale: 0.96,
                y: 10,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                y: 0,
                opacity: 1,
              }}
              exit={{
                scale: 0.98,
                y: 10,
                opacity: 0,
              }}
            >
              <div
                className={styles.modalHeader}
              >
                <div
                  className={styles.modalTitle}
                >
                  {openItem?.title ||
                    "Video"}
                </div>

                <button
                  type="button"
                  className={
                    styles.closeButton
                  }
                  onClick={() =>
                    setOpenItem(null)
                  }
                  aria-label={copy.close}
                >
                  ✕
                </button>
              </div>

              <div
                className={styles.modalMedia}
              >
                <VideoPlayer
                  item={openItem}
                  invalidText={
                    copy.invalid
                  }
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}