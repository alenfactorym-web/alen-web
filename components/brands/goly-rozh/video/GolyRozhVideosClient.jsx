"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import GolyRozhReveal from "../shared/GolyRozhReveal";
import GolyRozhSectionHeading from "../shared/GolyRozhSectionHeading";

import styles from "./GolyRozhVideosPage.module.css";

const COPY = {
  en: {
    eyebrow: "EXPLORE",
    titleTop: "GOLY ROZH",
    titleBottom: "VIDEOS",
    desc: "Watch official Goly Rozh videos and discover our latest highlights.",

    play: "Play",
    back: "Back",
    prev: "Prev",
    next: "Next",

    empty: "No videos available yet.",
    invalid: "Invalid video source.",
    close: "Close",
  },

  ar: {
    eyebrow: "استكشف",
    titleTop: "GOLY ROZH",
    titleBottom: "الفيديوهات",
    desc: "شاهد فيديوهات Goly Rozh الرسمية واكتشف أحدث المقاطع.",

    play: "تشغيل",
    back: "رجوع",
    prev: "السابق",
    next: "التالي",

    empty: "لا توجد فيديوهات حالياً.",
    invalid: "مصدر الفيديو غير صالح.",
    close: "إغلاق",
  },

  ku: {
    eyebrow: "بگەڕێ",
    titleTop: "گولی ڕۆژ",
    titleBottom: "ڤیدیۆکان",
    desc: "تەماشای ڤیدیۆ فەرمییەکانی گولی ڕۆژ و نوێترین ساتەکان بکە.",

    play: "پێکردن",
    back: "گەڕانەوە",
    prev: "پێشوو",
    next: "داهاتوو",

    empty: "هێشتا هیچ ڤیدیۆیەک بەردەست نییە.",
    invalid: "سەرچاوەی ڤیدیۆ دروست نییە.",
    close: "داخستن",
  },
};

function getYouTubeId(url) {
  try {
    const value = String(url || "").trim();

    if (!value) return null;

    const parsed = new URL(value);

    if (parsed.hostname.includes("youtu.be")) {
      return (
        parsed.pathname
          .replace("/", "")
          .split("?")[0] || null
      );
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");

      if (id) return id;

      if (parsed.pathname.startsWith("/shorts/")) {
        return (
          parsed.pathname
            .split("/shorts/")[1]
            ?.split("?")[0] || null
        );
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return (
          parsed.pathname
            .split("/embed/")[1]
            ?.split("?")[0] || null
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
    item?.youtubeUrl ||
    item?.videoUrl ||
    item?.fileUrl ||
    `${item?.title || "video"}-${item?.date || ""}`
  );
}
function getLocalizedTitle(item, lang) {
  if (!item) return "Video";

  if (lang === "ar") {
    return (
      item.title_ar ||
      item.title_en ||
      item.title ||
      "Video"
    );
  }

  if (lang === "ku") {
    return (
      item.title_ku ||
      item.title_en ||
      item.title ||
      "Video"
    );
  }

  return (
    item.title_en ||
    item.title ||
    "Video"
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

function VideoPlayer({
  item,
  invalidText,
}) {
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
  lang,
  copy,
  onOpen,
}) {
  const poster = getPoster(item);
const localizedTitle =
  getLocalizedTitle(item, lang);
  const titleFont =
    lang === "ar"
      ? "font-ar-title"
      : lang === "ku"
        ? "ku-title"
        : "";

  const isRTL =
    lang === "ar" ||
    lang === "ku";

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
              alt={localizedTitle}
              className={styles.cardImage}
              draggable="false"
            />
          ) : (
            <div
              className={styles.cardImageFallback}
            />
          )}

          <div
            className={styles.cardShade}
          />

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
            dir={isRTL ? "rtl" : "ltr"}
          >
            {localizedTitle}
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

export default function GolyRozhVideosClient({
  list = [],
  lang = "en",
  page = 1,
  totalPages = 1,
}) {
  const { lang: activeLang } = useLanguage();

const currentLang = ["en", "ar", "ku"].includes(activeLang)
  ? activeLang
  : ["en", "ar", "ku"].includes(lang)
    ? lang
    : "en";

  const copy = COPY[currentLang];

  const isRTL =
    currentLang === "ar" ||
    currentLang === "ku";

  const titleFont =
    currentLang === "ar"
      ? "font-ar-title"
      : currentLang === "ku"
        ? "ku-title"
        : "";

  const [openItem, setOpenItem] =
    useState(null);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const stableList = useMemo(() => {
    const source = Array.isArray(list)
      ? list
      : [];

    const seen = new Set();

    return source.filter((item) => {
      const uid = getUid(item);

      if (!uid || seen.has(uid)) {
        return false;
      }

      seen.add(uid);

      return true;
    });
  }, [list]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  function goToPage(nextPage) {
    const safeNextPage = Math.max(
      1,
      Math.min(
        totalPages,
        nextPage,
      ),
    );

    const qs = new URLSearchParams(
      searchParams?.toString() || "",
    );

    qs.set("lang", currentLang);
    qs.set(
      "page",
      String(safeNextPage),
    );

    router.push(
      `${pathname}?${qs.toString()}`,
      {
        scroll: true,
      },
    );
  }

  useEffect(() => {
    if (!openItem) return;

    const scrollY = window.scrollY;

    const originalHtmlOverflow =
      document.documentElement.style
        .overflow;

    const originalBodyOverflow =
      document.body.style.overflow;

    const originalBodyPosition =
      document.body.style.position;

    const originalBodyTop =
      document.body.style.top;

    const originalBodyWidth =
      document.body.style.width;

    document.documentElement.style.overflow =
      "hidden";

    document.body.style.overflow =
      "hidden";

    document.body.style.position =
      "fixed";

    document.body.style.top =
      `-${scrollY}px`;

    document.body.style.width =
      "100%";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpenItem(null);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.documentElement.style.overflow =
        originalHtmlOverflow;

      document.body.style.overflow =
        originalBodyOverflow;

      document.body.style.position =
        originalBodyPosition;

      document.body.style.top =
        originalBodyTop;

      document.body.style.width =
        originalBodyWidth;

      window.scrollTo(
        0,
        scrollY,
      );
    };
  }, [openItem]);

  return (
    <main
      className={`mini-site mini-site-goly-rozh ${styles.page}`}
      dir={isRTL ? "rtl" : "ltr"}
      data-lang={currentLang}
    >
      <section
        className={styles.section}
      >
        <div
          className={styles.inner}
        >
          <GolyRozhReveal
            key={currentLang}
            className={
              styles.headingWrap
            }
            replayKey={currentLang}
          >
            <GolyRozhSectionHeading
              eyebrow={copy.eyebrow}
              titleTop={copy.titleTop}
              titleBottom={
                copy.titleBottom
              }
              desc={copy.desc}
              lang={currentLang}
              className={
                styles.heading
              }
            />
          </GolyRozhReveal>

          {stableList.length > 0 ? (
            <div
              className={
                styles.videoGrid
              }
            >
              {stableList.map(
                (item, index) => (
                  <VideoCard
                    key={
                      getUid(item) ||
                      index
                    }
                    item={item}
                    lang={currentLang}
                    copy={copy}
                    onOpen={
                      setOpenItem
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <div
              className={`${styles.emptyList} ${titleFont}`}
            >
              {copy.empty}
            </div>
          )}

          <div
            className={
              styles.pagination
            }
            dir="ltr"
          >
            <Link
              href={`/brand/goly-rozh?lang=${currentLang}#video`}
              className={`${styles.navButton} ${styles.backButton} ${titleFont}`}
            >
              <span>
                {copy.back}
              </span>

              <span
                className={
                  styles.backArrow
                }
                aria-hidden="true"
              >
                ←
              </span>
            </Link>

            <div
              className={
                styles.pager
              }
            >
              <button
                type="button"
                disabled={!canPrev}
                onClick={() =>
                  goToPage(
                    page - 1,
                  )
                }
                className={`${styles.navButton} ${titleFont}`}
              >
                {copy.prev}
              </button>

              <span
                className={
                  styles.pageNumber
                }
              >
                {page} / {totalPages}
              </span>

              <button
                type="button"
                disabled={!canNext}
                onClick={() =>
                  goToPage(
                    page + 1,
                  )
                }
                className={`${styles.navButton} ${titleFont}`}
              >
                {copy.next}
              </button>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {openItem && (
          <motion.div
            className={
              styles.modalBackdrop
            }
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.22,
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
              className={
                styles.modal
              }
              initial={{
                opacity: 0,
                scale: 0.97,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.98,
                y: 8,
              }}
              transition={{
                duration: 0.24,
              }}
            >
              <div
                className={
                  styles.modalHeader
                }
                dir={
                  isRTL
                    ? "rtl"
                    : "ltr"
                }
              >
                <div
                  className={`${styles.modalTitle} ${titleFont}`}
                >
                 {getLocalizedTitle(
  openItem,
  currentLang,
)}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setOpenItem(null)
                  }
                  className={
                    styles.closeButton
                  }
                  aria-label={
                    copy.close
                  }
                >
                  ✕
                </button>
              </div>

              <div
                className={
                  styles.modalMedia
                }
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
    </main>
  );
}