"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./AlshafiProductShowcaseModal.module.css";

function pickLang(obj, lang) {
  if (!obj) return "";
  if (lang === "ar") return obj.ar || obj.en || "";
  if (lang === "ku") return obj.ku || obj.en || "";
  return obj.en || "";
}

function cartonWord(lang) {
  if (lang === "ar") return "كرتون";
  if (lang === "ku") return "کارتۆن";
  return "carton";
}

function getCartonText(item, lang) {
  const unitsPerPack = Number(item?.unitsPerPack || 0);
  const packsPerCarton = Number(item?.packsPerCarton || 0);

  if (unitsPerPack > 0 && packsPerCarton > 0) {
    if (lang === "ar") return `${packsPerCarton} باكيت × ${unitsPerPack}`;
    if (lang === "ku") return `${packsPerCarton} پاکێت × ${unitsPerPack}`;
    return `${packsPerCarton} packs × ${unitsPerPack}`;
  }

  return "-";
}

function getItemLabel(item, lang, index = 0) {
  return (
    pickLang(item?.name, lang) ||
    pickLang(item?.title, lang) ||
    item?.label ||
    `Product ${index + 1}`
  );
}

function getPackagingLabel(item, lang) {
  return (
    pickLang(item?.productGroup?.title, lang) ||
    pickLang(item?.productGroupTitle, lang) ||
    item?.productGroupSlug ||
    item?.packagingType ||
    item?.packaging ||
    "-"
  );
}
function getProductKey(item, index) {
  return `${item?.id || item?._id || item?.image || index}`;
}
function AutoFitTitle({ children, className = "" }) {
  const wrapRef = useRef(null);
  const measureRef = useRef(null);
  const [fitSize, setFitSize] = useState(null);

  useEffect(() => {
    function fitTitle() {
      const wrap = wrapRef.current;
      const measure = measureRef.current;

      if (!wrap || !measure) return;

      const available = wrap.clientWidth;
      const needed = measure.scrollWidth;
      const baseSize = parseFloat(window.getComputedStyle(wrap).fontSize) || 28;

      if (!available || !needed) return;

      const scale = needed > available ? available / needed : 1;
      const nextSize = Math.max(12, Math.floor(baseSize * scale * 100) / 100);

      setFitSize((prev) =>
        Math.abs((prev || baseSize) - nextSize) < 0.2 ? prev : nextSize
      );
    }

    const frameOne = requestAnimationFrame(fitTitle);
    const frameTwo = requestAnimationFrame(() => requestAnimationFrame(fitTitle));

    let resizeObserver;

    if (typeof ResizeObserver !== "undefined" && wrapRef.current) {
      resizeObserver = new ResizeObserver(fitTitle);
      resizeObserver.observe(wrapRef.current);
    }

    document.fonts?.ready?.then(fitTitle);

    return () => {
      cancelAnimationFrame(frameOne);
      cancelAnimationFrame(frameTwo);
      resizeObserver?.disconnect();
    };
  }, [children]);

  return (
    <h2 ref={wrapRef} className={className}>
      <span
        className={styles.productTitleText}
        style={fitSize ? { fontSize: `${fitSize}px` } : undefined}
      >
        {children}
      </span>

      <span ref={measureRef} className={styles.productTitleMeasure} aria-hidden="true">
        {children}
      </span>
    </h2>
  );
}
function getSlotMotion(slot, device = "default") {
const isLaptop = device === "laptop";
const isTabletPortrait = device === "tabletPortrait";
const isTabletLandscape = device === "tabletLandscape";  


const sideX = isTabletPortrait ? 250 : isTabletLandscape ? 360 : isLaptop ? 434 : 520;
const sideY = isTabletPortrait ? 25 : isTabletLandscape ? 155 : 85;
const sideScale = isTabletPortrait ? 0.44 : isTabletLandscape ? 0.54 : 0.62;
const sideOpacity = isTabletPortrait ? 0.24 : isTabletLandscape ? 0.24 : 0.30;

const activeY = isTabletPortrait ? 15 : isTabletLandscape ? 90 : isLaptop ? 130 : 250;
  const activeScale = isTabletPortrait ? 1.18 : isTabletLandscape ? 1.22 : 1.05;

  if (slot === 0) {
    return {
      x: 0,
      y: activeY,
      scale: activeScale,
      opacity: 1,
      zIndex: 20,
    };
  }

  if (slot === -1) {
    return {
      x: -sideX,
      y: sideY,
      scale: sideScale,
      opacity: sideOpacity,
      zIndex: 2,
    };
  }

  return {
    x: sideX,
    y: sideY,
    scale: sideScale,
    opacity: sideOpacity,
    zIndex: 2,
  };
}
export default function AlshafiProductShowcaseModal({
  open,
  items = [],
  activeIndex = 0,
  lang = "en",
  onClose,
  onNext,
  onPrev,
}) {
  const safeLang = ["en", "ar", "ku"].includes(lang) ? lang : "en";
  const isRTL = safeLang === "ar" || safeLang === "ku";
  const startRef = useRef({ x: 0, y: 0 });
const [showcaseDevice, setShowcaseDevice] = useState("default");
const [imageRatios, setImageRatios] = useState({});
const [slideDirection, setSlideDirection] = useState(-1);

function getActiveImageClass(ratio) {
  if (!ratio) return "";

  if (ratio >= 0.72) {
    return styles.mainImageBox;
  }

  if (ratio >= 0.55) {
    return styles.mainImageMedium;
  }

  return styles.mainImageBottle;
}

useEffect(() => {
  const laptopQuery = window.matchMedia(
    "(min-width: 1024px) and (max-height: 899px) and (orientation: landscape) and (hover: hover) and (pointer: fine)"
  );

  const tabletPortraitQuery = window.matchMedia(
    "(min-width: 601px) and (max-width: 1180px) and (orientation: portrait)"
  );

const tabletLandscapeQuery = window.matchMedia(
  "(min-width: 768px) and (max-width: 1366px) and (orientation: landscape)"
);
  const updateShowcaseDevice = () => {
  if (tabletLandscapeQuery.matches) {
    setShowcaseDevice("tabletLandscape");
    return;
  }

  if (laptopQuery.matches) {
    setShowcaseDevice("laptop");
    return;
  }

  if (tabletPortraitQuery.matches) {
    setShowcaseDevice("tabletPortrait");
    return;
  }

  setShowcaseDevice("default");
};

  updateShowcaseDevice();

  laptopQuery.addEventListener("change", updateShowcaseDevice);
  tabletPortraitQuery.addEventListener("change", updateShowcaseDevice);
  tabletLandscapeQuery.addEventListener("change", updateShowcaseDevice);

  return () => {
    laptopQuery.removeEventListener("change", updateShowcaseDevice);
    tabletPortraitQuery.removeEventListener("change", updateShowcaseDevice);
    tabletLandscapeQuery.removeEventListener("change", updateShowcaseDevice);
  };
}, []);

  const total = Array.isArray(items) ? items.length : 0;
  const activeItem = total > 0 ? items[activeIndex] : null;

 const prevIndex = total > 0 ? (activeIndex - 1 + total) % total : 0;
const nextIndex = total > 0 ? (activeIndex + 1) % total : 0;

const prevItem = total > 0 ? items[prevIndex] : null;
const nextItem = total > 0 ? items[nextIndex] : null;

const oppositeIndex = total === 2 ? (activeIndex + 1) % total : 0;
const oppositeItem = total === 2 ? items[oppositeIndex] : null;

const visibleProducts =
  total === 1
    ? [{ item: activeItem, index: activeIndex, slot: 0 }]
    : total === 2
    ? [
        {
          item: oppositeItem,
          index: oppositeIndex,
          slot: slideDirection === 1 ? -1 : 1,
        },
        {
          item: activeItem,
          index: activeIndex,
          slot: 0,
        },
      ]
    : [
        { item: prevItem, index: prevIndex, slot: -1 },
        { item: activeItem, index: activeIndex, slot: 0 },
        { item: nextItem, index: nextIndex, slot: 1 },
      ];

  const activeLabel = useMemo(
    () => getItemLabel(activeItem, safeLang, activeIndex),
    [activeItem, safeLang, activeIndex]
  );

  const packagingLabel = useMemo(
  () => getPackagingLabel(activeItem, safeLang),
  [activeItem, safeLang]
);

const activeInfo = useMemo(
  () => ({
    key: `${activeIndex}-${activeItem?.id || activeItem?._id || activeItem?.image || activeLabel}`,
    item: activeItem,
    label: activeLabel,
    packagingLabel,
    index: activeIndex,
  }),
  [activeIndex, activeItem, activeLabel, packagingLabel]
);

const [infoSeq, setInfoSeq] = useState(0);
const [exitingInfo, setExitingInfo] = useState(null);
const previousInfoRef = useRef(null);

useEffect(() => {
  if (!activeInfo.item) return;

  const previousInfo = previousInfoRef.current;

  if (previousInfo && previousInfo.key !== activeInfo.key) {
    setExitingInfo({
      ...previousInfo,
      exitKey: `${previousInfo.key}-${Date.now()}`,
    });

    setInfoSeq((prev) => prev + 1);

    const timer = window.setTimeout(() => {
      setExitingInfo(null);
    }, 2300);

    previousInfoRef.current = activeInfo;

    return () => window.clearTimeout(timer);
  }

  previousInfoRef.current = activeInfo;
}, [activeInfo]);

function renderInfoContent(info) {
  if (!info?.item) return null;
  return (
    <>
      <div className={styles.infoTop}>
        <span className={`${styles.brandText} ${styles.forceEnglishFont}`}>
  ALSHAFI
</span>
      </div>

      <AutoFitTitle className={styles.productTitle}>
  {info.label}
</AutoFitTitle>

      <div className={styles.specGrid}>
        <div className={styles.specItem}>
          <span>
            {safeLang === "ar"
              ? "نوع التعبئة"
              : safeLang === "ku"
              ? "جۆری پاکەت"
              : "Packaging"}
          </span>
          <strong>{info.packagingLabel}</strong>
        </div>

        <div className={styles.specItem}>
          <span>
            {safeLang === "ar"
              ? "الكمية / كرتون"
              : safeLang === "ku"
              ? "ژمارە / کارتۆن"
              : `QTY / ${cartonWord(safeLang)}`}
          </span>
          <strong>{getCartonText(info.item, safeLang)}</strong>
        </div>

        <div className={styles.specItem}>
          <span>
            {safeLang === "ar"
              ? "عدد الوحدات"
              : safeLang === "ku"
              ? "ژمارەی دانە"
              : "Units / Pack"}
          </span>
          <strong>{info.item?.unitsPerPack || "-"}</strong>
        </div>

        <div className={styles.specItem}>
          <span>
            {safeLang === "ar"
              ? "باكيت / كرتون"
              : safeLang === "ku"
              ? "پاکێت / کارتۆن"
              : "Packs / Carton"}
          </span>
          <strong>{info.item?.packsPerCarton || "-"}</strong>
        </div>
      </div>

      <div className={styles.cardBottom}>
        <div className={styles.progressTrack}>
          <span
            className={styles.progressFill}
            style={{
              width: `${((info.index + 1) / total) * 100}%`,
            }}
          />
        </div>

        <span className={styles.indexText}>
          {info.index + 1} / {total}
        </span>
      </div>
    </>
  );
}

const goNext = useCallback(() => {
  setSlideDirection(1);

  if (isRTL) onPrev?.();
  else onNext?.();
}, [isRTL, onNext, onPrev]);

const goPrev = useCallback(() => {
  setSlideDirection(-1);

  if (isRTL) onNext?.();
  else onPrev?.();
}, [isRTL, onNext, onPrev]);

  useEffect(() => {
    if (!open) return;

    function handleKey(e) {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose, goNext, goPrev]);

  useEffect(() => {
    if (!open) return;

    let locked = false;

    function handleWheel(e) {
      e.preventDefault();

      if (locked) return;
      if (Math.abs(e.deltaY) < 12 && Math.abs(e.deltaX) < 12) return;

      locked = true;

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.deltaX > 0 ? goNext() : goPrev();
      } else {
        e.deltaY > 0 ? goNext() : goPrev();
      }

      setTimeout(() => {
        locked = false;
      }, 560);
    }

    window.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel, {
        capture: true,
      });
    };
  }, [open, goNext, goPrev]);

  function handlePointerDown(e) {
    startRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
  }

  function handlePointerUp(e) {
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;

    if (Math.abs(dx) < 42) return;
    if (Math.abs(dy) > Math.abs(dx) * 0.8) return;

    dx < 0 ? goNext() : goPrev();
  }

  if (!open || !activeItem || total <= 0) return null;

  return (
    <div className={styles.overlay} dir={isRTL ? "rtl" : "ltr"}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close"
        onClick={onClose}
      />

      <div
        className={styles.stage}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <button
          type="button"
          className={styles.closeButton}
          aria-label={
            safeLang === "ar" ? "إغلاق" : safeLang === "ku" ? "داخستن" : "Close"
          }
          onClick={onClose}
        >
          ×
        </button>

       <button
  type="button"
  dir="ltr"
  className={`${styles.arrowButton} ${styles.arrowLeft}`}
  aria-label={
    safeLang === "ar" ? "السابق" : safeLang === "ku" ? "پێشوو" : "Previous"
  }
  onClick={goPrev}
>
  <span className={styles.arrowIcon}>‹</span>
</button>

<button
  type="button"
  dir="ltr"
  className={`${styles.arrowButton} ${styles.arrowRight}`}
  aria-label={
    safeLang === "ar" ? "التالي" : safeLang === "ku" ? "داهاتوو" : "Next"
  }
  onClick={goNext}
>
  <span className={styles.arrowIcon}>›</span>
</button>

       <div className={styles.imageScene}>
  <div className={styles.carouselRing}>
    {visibleProducts.map(({ item, index, slot }) => {
      if (!item) return null;

     const isActive = slot === 0;
const productKey = getProductKey(item, index);
const activeImageClass = isActive
  ? getActiveImageClass(imageRatios[productKey])
  : "";
      return (
        <motion.div
          key={productKey}
          className={`${styles.productSlot} ${
            isActive ? styles.productSlotActive : styles.productSlotSide
          }`}
          initial={false}
          animate={getSlotMotion(slot, showcaseDevice)}
        transition={{
  duration: 2.15,
  ease: [0.16, 1, 0.3, 1],
}}
        >
{isActive ? <div className={styles.mainProductGlow} /> : null}

{isActive ? (
 <motion.div
  className={styles.bottleShadow}
  initial={{
    opacity: 0,
    scaleX: 0.72,
    scaleY: 0.72,
  }}
  animate={{
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
  }}
  exit={{
    opacity: 0,
    scaleX: 0.72,
    scaleY: 0.72,
  }}
  transition={{
    duration: 0.75,
    ease: [0.16, 1, 0.3, 1],
  }}
/>
) : null}

<Image
  src={item.image || "/fallback.png"}
  alt={getItemLabel(item, safeLang, index)}
  fill
  priority={isActive}
  sizes={isActive ? "(max-width: 768px) 82vw, 38vw" : "20vw"}
  className={`${isActive ? styles.mainImage : styles.productImage} ${activeImageClass}`}
  draggable={false}
  onLoad={(e) => {
    const img = e.currentTarget;
    const ratio = img.naturalWidth / img.naturalHeight;

    setImageRatios((prev) => {
      if (prev[productKey] === ratio) return prev;
      return {
        ...prev,
        [productKey]: ratio,
      };
    });
  }}
/>        </motion.div>
      );
    })}
  </div>
</div>

<div className={styles.infoCard}>
  <div className={styles.infoFadeWindow}>
    {exitingInfo ? (
      <motion.div
        key={`exit-${exitingInfo.exitKey}`}
        className={styles.infoInner}
        initial={{
          y: "0%",
        }}
        animate={{
          y: "-130%",
        }}
        transition={{
          duration: 2.15,
          ease: [0.19, 1, 0.22, 1],
        }}
      >
        {renderInfoContent(exitingInfo)}
      </motion.div>
    ) : null}

    <motion.div
      key={`enter-${infoSeq}-${activeInfo.key}`}
      className={styles.infoInner}
      initial={{
        y: "130%",
      }}
      animate={{
        y: "0%",
      }}
      transition={{
        duration: 2.15,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      {renderInfoContent(activeInfo)}
    </motion.div>
  </div>
</div>      </div>
    </div>
  );
}