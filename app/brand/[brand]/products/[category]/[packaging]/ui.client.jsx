"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeader from "@/components/products/SectionHeader";
import CategoryCylinder from "@/components/products/CategoryCylinder";
import { MotionTitle, MotionSubtitle } from "@/components/ui/MotionText";
import CategoryBlurBar from "@/components/products/CategoryBlurBar";

// -------------------- helpers --------------------
function pickLang(obj, lang) {
  if (!obj) return "";
  if (lang === "ar") return obj.ar || obj.en || "";
  if (lang === "ku") return obj.ku || obj.en || "";
  return obj.en || "";
}

function fileLabelFromSrc(src) {
  const file = String(src || "").split("/").pop() || "";
  return file.replace(/\.(webp|png|jpg|jpeg)$/i, "").replace(/-/g, " ").toUpperCase();
}

function wrapOffset(offset, total) {
  if (!total) return 0;
  const half = total / 2;
  let o = offset;
  if (o > half) o -= total;
  if (o < -half) o += total;
  return o;
}

function cartonWord(lang) {
  if (lang === "ar") return "كرتون";
  if (lang === "ku") return "کارتۆن";
  return "carton";
}

function preloadImage(src) {
  if (!src || typeof window === "undefined") return;
  const img = new window.Image();
  img.src = src;
}function getCartonText(item, lang, fallbackCartonQty = null, compact = false) {
  const unitsPerPack = Number(item?.unitsPerPack || 0);
  const packsPerCarton = Number(item?.packsPerCarton || 0);

  if (unitsPerPack > 0 && packsPerCarton > 0) {
    if (compact) return `${packsPerCarton}×${unitsPerPack}`;

    if (lang === "ar") return `${packsPerCarton} باكيت × ${unitsPerPack}`;
    if (lang === "ku") return `${packsPerCarton} پاکێت × ${unitsPerPack}`;
    return `${packsPerCarton} packs × ${unitsPerPack}`;
  }

  if (fallbackCartonQty) return String(fallbackCartonQty);

  return "-";
}
// -------------------- main --------------------
export default function PackagingGalleryClient({
  brand,
  category,
  packaging,
  lang,
  isGroupLandingPage = false,  serverItems,
  serverCartonQty,
  serverPackTitle,
    serverPackagingList,
  serverProductGroupsList,
  serverBackHref,
  allCategories = [],
  page,
  perPage,
  total,
})
{  const router = useRouter();
  const safeLang = (lang || "en").toLowerCase();
  const isRTL = safeLang === "ar" || safeLang === "ku";
  const uiFont = safeLang === "ar" ? "font-ar-title" : safeLang === "ku" ? "ku-title" : "";
  const revealMode = safeLang === "en" ? "chars" : "block";

    const packagingList = useMemo(
    () => (Array.isArray(serverPackagingList) ? serverPackagingList : []),
    [serverPackagingList]
  );

  const pack = useMemo(() => {
    return (
      packagingList.find(
        (p) => String(p?.slug || "").toLowerCase() === String(packaging).toLowerCase()
      ) || null
    );
  }, [packagingList, packaging]);

  const allItems = Array.isArray(serverItems) ? serverItems : [];
  const modalTotal = allItems.length;

  // pagination
  const currentPage = Math.max(1, Number(page || 1));
  const effectivePerPage = Math.max(1, Number(perPage || 12));
  const effectiveTotal = Math.max(0, Number(total) || allItems.length || 0);
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / effectivePerPage));
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;
  const showTopBack =
  totalPages > 1 || (isGroupLandingPage && allItems.length > 3);   
  const baseHref = `/brand/${brand}/products/${category}/${packaging}?lang=${safeLang}&page=`;

  const headerTitle =
    safeLang === "ar" ? "منتجات" : safeLang === "ku" ? "بەرهەمەکان" : "Products";

  const subtitleObj = serverPackTitle ?? pack?.title ?? null;
  const subtitle = subtitleObj
    ? pickLang(subtitleObj, safeLang)
    : safeLang === "ar"
    ? "غير متوفر"
    : safeLang === "ku"
    ? "بەردەست نییە"
    : "Not available";

  const cartonQty = serverCartonQty ?? pack?.cartonQty ?? null;

 const resetKey = `${brand}-${category}-${packaging}-${safeLang}`;
const isDirectProducts = String(packaging || "").toLowerCase() === "direct";
const backHref =
  serverBackHref ||
  (isDirectProducts
    ? brand === "alen"
      ? `/?lang=${safeLang}#products`
      : `/brand/${brand}/products?lang=${safeLang}`
    : `/brand/${brand}/products/${category}?lang=${safeLang}`);

  const getItemSrc = (item) => {
  let src = "";

  if (item && typeof item === "object") {
    src = item.image || "";
  }

  // ✅ اگر محصول عکس نداشت → از عکس packaging استفاده کن
  if (!src && pack?.image) {
    src = pack.image;
  }

  if (!src || !src.includes("cdn.sanity.io")) return src;

  return `${src}?auto=format&fit=max&w=900&q=80`;
};

  const getItemLabel = (item) => {
  if (item && typeof item === "object") {
    const productName = pickLang(item.name, safeLang);
    const packagingTitle = pickLang(item.title, safeLang);

    return (
      productName ||
      packagingTitle ||
      item.label ||
      (item.image ? fileLabelFromSrc(item.image) : "ITEM")
    );
  }

  return fileLabelFromSrc(item);
};

   const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [activeCylinderSlug, setActiveCylinderSlug] = useState("");
  const closeModal = useCallback(() => setOpen(false), []);
const [isMobileView, setIsMobileView] = useState(false);

useEffect(() => {
  if (typeof window === "undefined") return;

  const mq = window.matchMedia("(max-width: 767px)");
  const update = () => setIsMobileView(mq.matches);

  update();

  if (mq.addEventListener) {
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }

  mq.addListener(update);
  return () => mq.removeListener(update);
}, []);
  // ✅ preloading for modal current/next/prev
  useEffect(() => {
    if (!open || !allItems.length) return;

    const current = allItems[activeIndex];
    const nextItem = allItems[(activeIndex + 1) % allItems.length];
    const prevItem = allItems[(activeIndex - 1 + allItems.length) % allItems.length];

    preloadImage(getItemSrc(current));
    preloadImage(getItemSrc(nextItem));
    preloadImage(getItemSrc(prevItem));
  }, [open, activeIndex, allItems]);

  const next = useCallback(() => {
    if (!modalTotal) return;
    setActiveIndex((p) => (p + 1) % modalTotal);
  }, [modalTotal]);

  const prev = useCallback(() => {
    if (!modalTotal) return;
    setActiveIndex((p) => (p - 1 + modalTotal) % modalTotal);
  }, [modalTotal]);

  const [step, setStep] = useState(360);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth || 360;
      const s = Math.min(460, Math.max(210, Math.round(w * 0.5)));
      setStep(s);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const startRef = useRef({ x: 0, y: 0 });
  const swipeNext = useCallback(() => (isRTL ? prev() : next()), [isRTL, next, prev]);
  const swipePrev = useCallback(() => (isRTL ? next() : prev()), [isRTL, next, prev]);

  const onTouchStart = useCallback((e) => {
    const p = e.touches?.[0];
    if (!p) return;
    startRef.current = { x: p.clientX, y: p.clientY };
  }, []);

  const onTouchEnd = useCallback(
    (e) => {
      const p = e.changedTouches?.[0];
      if (!p) return;
      const dx = p.clientX - startRef.current.x;
      const dy = p.clientY - startRef.current.y;
      if (Math.abs(dx) < 40) return;
      if (Math.abs(dy) > Math.abs(dx) * 0.8) return;
      if (dx < 0) swipeNext();
      else swipePrev();
    },
    [swipeNext, swipePrev]
  );

  const onPointerDown = useCallback((e) => {
    startRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback(
    (e) => {
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      if (Math.abs(dx) < 40) return;
      if (Math.abs(dy) > Math.abs(dx) * 0.8) return;
      if (dx < 0) swipeNext();
      else swipePrev();
    },
    [swipeNext, swipePrev]
  );

  useEffect(() => {
    if (!open) return;
    const idx = allItems.findIndex((x) => (x?.id || x?.image) === activeId);
    if (idx >= 0) setActiveIndex(idx);
  }, [open, activeId, allItems]);

  useEffect(() => {
    if (!open) return;

    let lock = false;

    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();

      if (!modalTotal) return;
      if (lock) return;
      if (Math.abs(e.deltaY) < 8) return;

      lock = true;
      e.deltaY > 0 ? next() : prev();
      setTimeout(() => {
        lock = false;
      }, 180);
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });

    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
    };
  }, [open, next, prev, modalTotal]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
      if (!modalTotal) return;
      if (e.key === "ArrowRight") (isRTL ? prev : next)();
      if (e.key === "ArrowLeft") (isRTL ? next : prev)();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeModal, next, prev, isRTL, modalTotal]);

  // ✅ Debounced navigation for CategoryCylinder
  const navTimerRef = useRef(null);
  const lastNavSlugRef = useRef(String(packaging || "").toLowerCase());

  useEffect(() => {
    lastNavSlugRef.current = String(packaging || "").toLowerCase();
  }, [packaging]);

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

const onCylinderChange = (slug) => {
  const nextSlug = String(slug || "").toLowerCase();
  if (!nextSlug) return;

  if (isGroupLandingPage) {
    lastNavSlugRef.current = nextSlug;
    setActiveCylinderSlug(nextSlug);
    return;
  }

  if (nextSlug === lastNavSlugRef.current) return;

  if (navTimerRef.current) clearTimeout(navTimerRef.current);

  lastNavSlugRef.current = nextSlug;
  setActiveCylinderSlug(nextSlug);

  navTimerRef.current = setTimeout(() => {
    const currentLang =
      typeof window !== "undefined"
        ? (new URLSearchParams(window.location.search).get("lang") || safeLang).toLowerCase()
        : safeLang;

    router.push(
      `/brand/${brand}/products/${category}/${nextSlug}?lang=${currentLang}&page=1`,
      { scroll: false }
    );

    navTimerRef.current = null;
  }, 180);
};if (!pack && !isDirectProducts && !serverItems?.length) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center text-zinc-500 font-bold">
      {safeLang === "ar"
        ? "لا توجد منتجات"
        : safeLang === "ku"
        ? "هیچ بەرهەمێک نییە"
        : "No products found"}
    </div>
  );
}

   
const productGroupsList = useMemo(
  () => (Array.isArray(serverProductGroupsList) ? serverProductGroupsList : []),
  [serverProductGroupsList]
);

const isGroupMode = productGroupsList.length > 0 && packagingList.length === 0;

const cylinderItems = useMemo(
  () =>
    isGroupMode
      ? productGroupsList.map((g) => ({
          slug: String(g.slug),
          label: pickLang(g.title, safeLang) || String(g.slug),
        }))
      : packagingList.map((p) => ({
          slug: String(p.slug),
          label: pickLang(p.title, safeLang) || String(p.slug),
        })),
  [isGroupMode, productGroupsList, packagingList, safeLang]
);

useEffect(() => {
  const routeSlug = String(packaging || "").toLowerCase();
  const firstSlug = String(cylinderItems?.[0]?.slug || "").toLowerCase();
  const exists = cylinderItems.some((x) => String(x.slug || "").toLowerCase() === routeSlug);

  setActiveCylinderSlug((prev) => {
    if (isGroupLandingPage) {
      if (prev && cylinderItems.some((x) => String(x.slug || "").toLowerCase() === prev)) {
        return prev;
      }
      return firstSlug;
    }

    if (navTimerRef.current) {
      return prev || (exists ? routeSlug : firstSlug);
    }

    return exists ? routeSlug : firstSlug;
  });
}, [packaging, cylinderItems, isGroupLandingPage]);return (
  <main className={`min-h-screen overflow-x-hidden ${uiFont}`} dir={isRTL ? "rtl" : "ltr"}>
    <section
      className={`relative pt-[110px] md:pt-[130px] pb-24 overflow-x-hidden overflow-y-visible ${
        open ? "pointer-events-none" : ""
      }`}
    >
        <div className="alen-laptop-wrap-1100 w-[min(1320px,96vw)] mx-auto px-4">
        <SectionHeader
  resetKey={resetKey}
  titleClassName="text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-600 group-hover:text-black transition-colors"
  arcClassName="mx-auto mt-2 w-[240px] h-[24px]"
  subtitleClassName="mt-1 text-zinc-500 max-w-2xl mx-auto text-base md:text-lg leading-tight"
  title={
    <MotionTitle
      as="span"
      className="inline-block"
      reveal={revealMode}
      effect="mask"
      stagger={safeLang === "en" ? 0.045 : 0}
      delay={0.03}
      y={20}
      blur={8}
      amount={0.85}
      once={false}
      duration={0.95}
      resetKey={`packaging-title-${resetKey}`}
      key={`packaging-title-${resetKey}`}
    >
      {safeLang === "ar" ? "منتجات" : safeLang === "ku" ? "بەرهەمەکان" : "Products"}
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
      resetKey={`packaging-sub-${resetKey}`}
      key={`packaging-sub-${resetKey}`}
    >
      {safeLang === "ar"
        ? "اختر نوع التغليف"
        : safeLang === "ku"
        ? "جۆری پاکەت هەڵبژێرە"
        : "Choose packaging type."}
    </MotionSubtitle>
  }
/>
<CategoryBlurBar
  categories={allCategories}
  activeCategory={category}
  brand={brand}
  lang={lang}
/>
      {!isDirectProducts && cylinderItems.length > 0 ? (
  <div className="mt-4">
    <div className="flex flex-col md:flex-row md:items-center gap-3">
      {showTopBack || isMobileView ? (
  <>
          {/* Mobile: Back on its own row */}
          <div className="md:hidden flex justify-start">
            <Link
              href={backHref}
              aria-label={safeLang === "ar" ? "رجوع" : safeLang === "ku" ? "گەڕانەوە" : "Back"}
              className="pointer-events-auto rounded-full border bg-white/90 px-4 py-1.5 text-[13px] font-bold text-zinc-500 hover:bg-white shadow-sm transition active:scale-95 hover:-translate-y-[1px]"
            >
              {safeLang === "ar" ? "رجوع" : safeLang === "ku" ? "گەڕانەوە" : "Back"}
            </Link>
          </div>

          {/* Desktop/Tablet: Back beside cylinder */}
          <div className="hidden md:block md:shrink-0">
            <Link
              href={backHref}
              aria-label={safeLang === "ar" ? "رجوع" : safeLang === "ku" ? "گەڕانەوە" : "Back"}
              className="pointer-events-auto rounded-full border bg-white/90 px-4 py-1.5 text-[13px] font-bold text-zinc-500 hover:bg-white shadow-sm transition active:scale-95 hover:-translate-y-[1px]"
            >
              {safeLang === "ar" ? "رجوع" : safeLang === "ku" ? "گەڕانەوە" : "Back"}
            </Link>
          </div>
        </>
      ) : null}

      <div className="flex-1 min-w-0">
        <CategoryCylinder
          items={cylinderItems}
          activeSlug={activeCylinderSlug}
          onChange={onCylinderChange}
          dir={isRTL ? "rtl" : "ltr"}
          compact
          hrefBase={isGroupLandingPage ? `/brand/${brand}/products/${category}` : undefined}
        />
      </div>
    </div>
  </div>
) : null}

        <div
  dir="ltr"
  className={
    isGroupLandingPage
  ? "alen-laptop-grid-3 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-4 xl:gap-4 max-w-[1100px] 2xl:max-w-[1400px] mx-auto mt-8"
      : `
    flex flex-wrap justify-center
    gap-3 md:gap-4 lg:gap-4 xl:gap-4
    max-w-[1100px] 2xl:max-w-[1400px]
    mx-auto mt-8
  `
  }
>
            {allItems.map((item, i) => {
              const itemSlug = String(item?.slug || "").toLowerCase();
              const isActiveCard = isGroupLandingPage && itemSlug === activeCylinderSlug;

              return (
            <motion.button
  key={item.id || item.slug || item.image || i}
  onMouseEnter={() => {
    if (isGroupLandingPage) {
      setActiveCylinderSlug(String(item?.slug || "").toLowerCase());
    }
  }}
  onFocus={() => {
    if (isGroupLandingPage) {
      setActiveCylinderSlug(String(item?.slug || "").toLowerCase());
    }
  }}
  onClick={() => {
    if (isGroupLandingPage) {
      router.push(
        `/brand/${brand}/products/${category}/${String(item?.slug || "").toLowerCase()}?lang=${safeLang}&page=1`,
        { scroll: false }
      );
      return;
    }

    preloadImage(getItemSrc(item));
    setActiveId(item?.id || item?.image || null);
    setOpen(true);
  }}
  whileHover={{ y: -4 }}
  transition={{ type: "spring", stiffness: 260, damping: 18 }}
  animate={
    isGroupLandingPage
      ? (isActiveCard ? { y: -10, scale: 0.98 } : { y: 0, scale: 0.95 })
      : undefined
  } 
 className={
  isGroupLandingPage
    ? `
  text-left w-full group block overflow-hidden rounded-3xl
  bg-white border border-black/10
  border-b-[6px] border-b-yellow-400
  shadow-[0_18px_35px_-28px_rgba(0,0,0,0.65)]
  hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.75)]
  hover:shadow-[0_40px_80px_-35px_rgba(0,0,0,0.9)]
  hover:-translate-y-1
  hover:border-black/20
  transition-all pointer-events-auto
  ${isActiveCard ? "shadow-[0_35px_70px_-35px_rgba(0,0,0,0.85)]" : ""}
`
    : `
  text-left group block overflow-hidden rounded-3xl
  bg-white border border-black/10
  border-b-[6px] border-b-yellow-400
  shadow-[0_22px_45px_-30px_rgba(0,0,0,0.7)]
  hover:shadow-[0_25px_50px_-30px_rgba(0,0,0,0.7)]
  hover:-translate-y-[2px]
  hover:border-black/20
  transition-all pointer-events-auto
  w-[calc(50%-6px)] md:w-[calc(25%-12px)]
`
}
>
               <div
  className={
    isGroupLandingPage
      ? "relative bg-zinc-200 overflow-hidden aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]"
      : "relative aspect-square w-full bg-zinc-200/70 overflow-hidden p-4 flex items-center justify-center group-hover:bg-zinc-100 transition-colors duration-300"
  }
>
  <Image
  src={getItemSrc(item) || "/fallback.png"}
  alt={getItemLabel(item)}
  fill
  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
   priority={i < 3} 
  className={
    isGroupLandingPage
      ? "absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
      : `
    object-contain
    transition-transform duration-300
    group-hover:scale-105
    will-change-transform opacity-100
  `
  }
  draggable={false}
/>
{isGroupLandingPage ? (
  <div className="absolute inset-0 bg-black/[0.04] group-hover:bg-black/[0.08] transition-all duration-300" />
) : null}
</div>

<div className={isGroupLandingPage ? "px-5 py-4 lg:px-4 lg:py-3" : "p-3 md:p-4"}>
  <div className="flex items-center justify-center">
    <div
      className="
        min-w-0 w-full
        font-black text-zinc-600 text-[11px] sm:text-[12px] md:text-[13px]
        leading-tight
        h-[20px]
        line-clamp-2
        text-center
        group-hover:text-black transition-colors
      "
    >
      {getItemLabel(item)}
    </div>
  </div>
</div>

 </motion.button>
                        );
          })}
          </div>

          {/* Navigation */}
<div className="alen-laptop-wrap-1100 mt-10 max-w-[1100px] 2xl:max-w-[1400px] mx-auto grid grid-cols-3 items-center">

  {/* Back - Left */}
  <div className="flex justify-start">
    <Link
      href={backHref}
      className="pointer-events-auto rounded-full border bg-white/90 px-4 py-1.5 text-[13px] font-bold text-zinc-500 hover:bg-white shadow-sm transition active:scale-95"
    >
      {safeLang === "ar" ? "رجوع" : safeLang === "ku" ? "گەڕانەوە" : "Back"}
    </Link>
  </div>

  {/* Center - Prev / Page / Next */}
  {!isGroupLandingPage ? (
    <div className="flex items-center justify-center gap-3">
     <Link
        href={baseHref + Math.max(1, currentPage - 1)}
            scroll={false}
        className={`rounded-full border bg-white/90 px-3 py-1.5 text-[13px] font-bold text-zinc-600 shadow-sm transition ${
          canPrev ? "hover:bg-white active:scale-95" : "pointer-events-none opacity-40"
        }`}
      >
        {safeLang === "ar" ? "السابق" : safeLang === "ku" ? "پێشوو" : "Prev"}
      </Link>

      <div className="text-[13px] font-bold text-zinc-500 min-w-[42px] text-center">
        {currentPage} / {totalPages}
      </div>

      <Link
        href={baseHref + Math.min(totalPages, currentPage + 1)}
            scroll={false}
        className={`rounded-full border bg-white/90 px-3 py-1.5 text-[13px] font-bold text-zinc-600 shadow-sm transition ${
          canNext ? "hover:bg-white active:scale-95" : "pointer-events-none opacity-40"
        }`}
      >
        {safeLang === "ar" ? "التالي" : safeLang === "ku" ? "داهاتوو" : "Next"}
       </Link>
    </div>
  ) : (
    <div></div>
  )}

  {/* Right spacer */}
  <div></div>

</div>        </div>
      </section>

      {/* ================= MODAL 3D ================= */}
      <AnimatePresence>
        {open && modalTotal > 0 && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              backdropFilter: "blur(20px) saturate(160%)",
              WebkitBackdropFilter: "blur(20px) saturate(160%)",
            }}
          >
            <div className="absolute inset-0 z-0" onClick={closeModal} />

            <div
  className="relative z-10 w-full h-[100svh] flex items-center justify-center overflow-hidden px-4"
  style={{
    perspective: "2000px",
    transformStyle: "preserve-3d",
    touchAction: "none",
    willChange: "transform",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              {allItems.map((item, index) => {
                const offset = wrapOffset(index - activeIndex, modalTotal);
                if (Math.abs(offset) > 1) return null;

                const isActive = index === activeIndex;
                const src = getItemSrc(item);
                const label = getItemLabel(item);

                return (
                  <motion.div
                    key={item.id || item.image || index}
                    initial={false}
                    animate={{
                      x: offset * step,
                      z: isActive ? 320 : -140,
                      rotateY: offset * -30,
                      rotateZ: offset * -0.5,
                      scale: isActive ? 1.0 : 0.8,
                      opacity: 1,
                    }}
                    transition={{ type: "spring", stiffness: 210, damping: 28 }}
                    style={{
  zIndex: isActive ? 100 : 10,
  position: "absolute",
  transformStyle: "preserve-3d",
  pointerEvents: isActive ? "auto" : "none",
  filter: isActive ? "brightness(100%)" : "brightness(60%)",
  willChange: "transform, opacity",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
}}
                    className="w-full max-w-[84vw] sm:max-w-[520px] lg:max-w-[560px]"
                  >
                    <div
                      className={`relative flex flex-col overflow-hidden border border-white/20 ${
                        isActive ? "bg-[#ededed]" : "bg-[#d7d7d7]"
                      } rounded-[38px] sm:rounded-[60px] max-h-[84svh] md:max-h-[80svh] shadow-2xl`}
                    >
                      {/* header */}
                      <div
                        className={`shrink-0 relative px-5 sm:px-8 pt-5 sm:pt-8 pb-3 transition-opacity duration-300 ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      >
                       <button
  type="button"
  aria-label={safeLang === "ar" ? "إغلاق" : safeLang === "ku" ? "داخستن" : "Close"}
  onClick={(e) => {
    e.stopPropagation();
    closeModal();
  }}
  className="absolute top-4 sm:top-6 left-4 sm:left-6 w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-zinc-400 hover:text-black"
>
  ✕
</button>

                        <h2
                          className={[
                            "text-[15px] sm:text-[18px] font-[1000] text-zinc-900",
                            "tracking-tight leading-tight",
                            "text-center",
                            "px-12 sm:px-14",
                            "whitespace-normal break-words",
                            "line-clamp-2",
                            "[@media(orientation:landscape)_and_(max-height:600px)]:text-[14px]",
                            "[@media(orientation:landscape)_and_(max-height:600px)]:px-10",
                          ].join(" ")}
                        >
                          {label}
                        </h2>
                      </div>

                      {/* image section */}
                      <div
  className="
    relative flex-1 min-h-0
    flex items-center justify-center
    p-3 sm:p-6 lg:p-8
    pt-2 sm:pt-3
    [@media(orientation:landscape)_and_(max-height:600px)]:p-3
    [@media(orientation:landscape)_and_(max-height:600px)]:pt-3
    [@media(orientation:landscape)_and_(max-height:600px)]:pb-2
  "
>
  <img
  src={src || "/fallback.png"}
  alt={label}
  className={`
    object-contain transition-all duration-500 will-change-transform
    max-w-full
    max-h-[52svh]
    [@media(orientation:landscape)_and_(max-height:600px)]:max-h-[32vh]
    ${isActive ? "scale-[1.00]" : "opacity-30"}
  `}
    style={{
      transform: "translateZ(0)",
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
    }}
    draggable="false"
  />
</div>

{/* details + progress */}
<div
                        className={`
                          shrink-0 relative px-6 sm:px-10 pb-5 sm:pb-7 space-y-2
                          transition-opacity duration-300
                          ${isActive ? "opacity-100" : "opacity-0"}
                          [@media(orientation:landscape)_and_(max-height:600px)]:px-5
                          [@media(orientation:landscape)_and_(max-height:600px)]:pb-4
                          [@media(orientation:landscape)_and_(max-height:600px)]:space-y-1
                        `}
                      >
                        <div className="flex justify-between items-baseline py-2 border-b border-black/5">
                          <span
                            className={`
                              text-[10px] sm:text-[11px] font-black text-zinc-500 uppercase
                              ${safeLang === "en" ? "tracking-[0.06em]" : "tracking-normal"}
                              [@media(orientation:landscape)_and_(max-height:600px)]:whitespace-nowrap
                            `}
                          >
                            {safeLang === "ar"
                              ? "Products"
                              : safeLang === "ku"
                              ? "بەرهەمەکان"
                              : "Products"}
                          </span>

                          <span className="text-[12px] sm:text-[13px] font-black text-zinc-900">
                            {subtitle}
                          </span>
                        </div>

                        <div className="flex justify-between items-baseline py-2">
                          <span
                            className={`
                              text-[10px] sm:text-[11px] font-black text-zinc-500 uppercase
                              ${safeLang === "en" ? "tracking-[0.18em]" : "tracking-normal"}
                              [@media(orientation:landscape)_and_(max-height:600px)]:whitespace-nowrap
                            `}
                          >
                            {safeLang === "ar"
                              ? "الكمية/كرتون"
                              : safeLang === "ku"
                              ? "ژمارە/کارتۆن"
                              : "QTY / CARTON"}
                          </span>

                          <span className="text-[12px] sm:text-[13px] font-black text-zinc-900">
                            {getCartonText(allItems[activeIndex], safeLang, cartonQty)}
                          </span>
                        </div>

                        <div className="pt-2 flex flex-col items-center gap-2">
                          <div className="text-[10px] sm:text-[11px] font-black text-zinc-500">
                            {activeIndex + 1} / {modalTotal}
                          </div>

                          <div className="w-full h-[2px] bg-black/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-yellow-400"
                              animate={{ width: `${((activeIndex + 1) / modalTotal) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <button
  type="button"
  aria-label={safeLang === "ar" ? "السابق" : safeLang === "ku" ? "پێشوو" : "Previous"}
  onClick={prev}
  className="absolute left-4 text-yellow-400 text-6xl z-[110]"
>
  ‹
</button>
<button
  type="button"
  aria-label={safeLang === "ar" ? "التالي" : safeLang === "ku" ? "داهاتوو" : "Next"}
  onClick={next}
  className="absolute right-4 text-yellow-400 text-6xl z-[110]"
>
  ›
</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
} 