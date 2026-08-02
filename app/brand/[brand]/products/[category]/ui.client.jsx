"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import SectionHeader from "@/components/products/SectionHeader";
import CategoryCylinder from "@/components/products/CategoryCylinder";
import { motion } from "framer-motion";
import { MotionTitle, MotionSubtitle } from "@/components/ui/MotionText";
import CategoryBlurBar from "@/components/products/CategoryBlurBar";
import CategoryPageClient from "@/components/brands/alshafi/products/category/CategoryPageClient";
function pickLang(obj, lang) {
  if (!obj) return "";
  if (lang === "ar") return obj.ar || obj.en || "";
  if (lang === "ku") return obj.ku || obj.en || "";
  return obj.en || "";
}

function PackagingCardsSkeleton() {
  return (
    <div
      dir="ltr"
      className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-5 xl:gap-6"
      style={
        typeof window !== "undefined" &&
        window.innerWidth >= 1024 &&
        window.innerWidth < 1440
          ? {
              gap: "12px",
            }
          : undefined
      }
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="
            overflow-hidden rounded-3xl
            bg-white border border-black/10
            border-b-[8px] border-b-yellow-400
            shadow-[0_18px_35px_-28px_rgba(0,0,0,0.65)]
            animate-pulse
          "
        >
          <div className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] bg-zinc-200/80" />
          <div className="px-5 py-4 lg:px-4 lg:py-3">
            <div className="h-4 w-24 rounded bg-zinc-200/80" />
            <div className="mt-2 h-[2.5px] w-12 rounded-full bg-zinc-200/80" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BrandCategoryClient({
  brand,
  category,
  lang,
  initialProductGroups = [],
  initialPackaging = [],
  allCategories = []
}) {

  if (brand === "alshafi") {
    return (
      <CategoryPageClient
        brand={brand}
        category={category}
        lang={lang}
        initialProductGroups={initialProductGroups}
        initialPackaging={initialPackaging}
        allCategories={allCategories}
      />
    );
  }

  const router = useRouter();

  const isRTL = lang === "ar" || lang === "ku";
  const uiFont = lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";
  const revealMode = lang === "en" ? "chars" : "block";
  const resetKey = `${brand}-${category}-${lang}`;

  const [loading, setLoading] = useState(true);
const [items, setItems] = useState(
  Array.isArray(initialProductGroups) && initialProductGroups.length > 0
    ? initialProductGroups
    : Array.isArray(initialPackaging)
    ? initialPackaging
    : []
);


 useEffect(() => {
  if (Array.isArray(initialProductGroups) && initialProductGroups.length > 0) {
    setItems(initialProductGroups);
  } else {
    setItems(Array.isArray(initialPackaging) ? initialPackaging : []);
  }
  setLoading(false);
}, [initialProductGroups, initialPackaging]);

 const cylinderItems = useMemo(() => {
  return items.map((p) => ({
    slug: p.slug,
    label: pickLang(p.title, lang),
  }));
}, [items, lang]);

  const cardsRef = useRef(new Map());
  const [activeSlug, setActiveSlug] = useState(cylinderItems?.[0]?.slug || "");
    const isGroupMode =
  Array.isArray(initialProductGroups) &&
  initialProductGroups.length > 0;
  const showTopBack = items.length > 3;
  const isTouchRef = useRef(false);
  const touchSetTimerRef = useRef(null);
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
  useEffect(() => {
    if (typeof window !== "undefined") {
      isTouchRef.current =
        window.matchMedia?.("(hover: none) and (pointer: coarse)")?.matches ?? false;
    }
  }, []);

  useEffect(() => {
    if (!activeSlug && cylinderItems?.[0]?.slug) setActiveSlug(cylinderItems[0].slug);
  }, [cylinderItems, activeSlug]);

  useEffect(() => {
    return () => {
      if (touchSetTimerRef.current) clearTimeout(touchSetTimerRef.current);
    };
  }, []);

  const goPackaging = (slug) => {
    if (!slug) return;
    router.push(`/brand/${brand}/products/${category}/${slug}?page=1&lang=${lang}`);
  };

 const onActiveChange = (slug) => {
  setActiveSlug((prev) => (prev === slug ? prev : slug));
};

  if (loading) {
    return (
      <main className={`min-h-screen ${uiFont}`}>
        <section className={`relative pt-36 md:pt-60 pb-24 bg-transparent overflow-hidden isolate ${uiFont}`}>
          <div
            className="relative z-10 w-[min(1500px,96vw)] mx-auto px-[clamp(16px,3vw,56px)]"
            dir={isRTL ? "rtl" : "ltr"}
          >
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
  resetKey={`pack-title-${resetKey}`}
>
  {isGroupMode
    ? (lang === "ar"
        ? "مجموعة المنتجات"
        : lang === "ku"
        ? "گرووپی بەرهەم"
        : "Product Group")
    : (lang === "ar"
        ? "التغليف"
        : lang === "ku"
        ? "جۆری پاکەت"
        : "Packaging")}
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
  resetKey={`pack-sub-${resetKey}`}
>
  {isGroupMode
    ? (lang === "ar"
        ? "اختر مجموعة المنتج"
        : lang === "ku"
        ? "گرووپی بەرهەم هەڵبژێرە"
        : "Choose product group")
    : (lang === "ar"
        ? "اختر نوع التغليف"
        : lang === "ku"
        ? "جۆری پاکەت هەڵبژێرە"
        : "Choose packaging type.")}
</MotionSubtitle>
              }
            />

            <div className="max-w-[92vw] md:max-w-5xl mx-auto mt-6 mb-5 px-1 md:px-0">
              <div className="h-12 rounded-full bg-transparent border-0 shadow-none animate-pulse" />
            </div>

            <PackagingCardsSkeleton />
          </div>
        </section>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className={`min-h-screen ${uiFont}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="w-[min(1500px,96vw)] mx-auto px-[clamp(16px,3vw,56px)] py-24">
          <div className="rounded-2xl border border-black/10 bg-white/80 p-6 text-zinc-500 font-bold text-center">
  {lang === "ar"
    ? "لا توجد عناصر حالياً"
    : lang === "ku"
    ? "هیچ بابەتێک نییە"
    : "No items available"}
</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <section className={`relative pt-24 md:pt-60 pb-24 bg-transparent overflow-hidden isolate ${uiFont}`}>
        <div
          className="relative z-10 w-[min(1500px,96vw)] mx-auto px-[clamp(16px,3vw,56px)]"
          dir={isRTL ? "rtl" : "ltr"}
        >
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
                resetKey={`pack-title-${resetKey}`}
              >
{isGroupMode
    ? (lang === "ar"
        ? "مجموعة المنتجات"
        : lang === "ku"
        ? "گرووپی بەرهەم"
        : "Product Group")
    : (lang === "ar"
        ? "التغليف"
        : lang === "ku"
        ? "جۆری پاکەت"
        : "Packaging")}
</MotionTitle>            }
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
  resetKey={`pack-sub-${resetKey}`}
>
  {isGroupMode
    ? (lang === "ar"
        ? "اختر مجموعة المنتج"
        : lang === "ku"
        ? "گرووپی بەرهەم هەڵبژێرە"
        : "Choose product group")
    : (lang === "ar"
        ? "اختر نوع التغليف"
        : lang === "ku"
        ? "جۆری پاکەت هەڵبژێرە"
        : "Choose packaging type.")}
</MotionSubtitle>
            }
          />

    <CategoryBlurBar
  categories={allCategories}
  activeCategory={category}
  brand={brand}
  lang={lang}
/>

          <div className="alen-laptop-wrap-1100 max-w-[1100px] 2xl:max-w-[1400px] mx-auto mt-4 mb-5 px-1 md:px-0 touch-pan-x overscroll-x-contain">
  <div className="flex flex-col md:flex-row md:items-center gap-3">
{showTopBack || isMobileView ? (
  <>
      {/* Mobile: Back on its own row */}
      <div className="md:hidden flex justify-start">
        <Link
          href={
            brand === "alen"
              ? `/?lang=${lang}#products`
              : `/brand/${brand}/products?lang=${lang}`
          }
          className="pointer-events-auto rounded-full border bg-white/90 px-4 py-1.5 text-[13px] font-bold text-zinc-500 hover:bg-white shadow-sm transition active:scale-95 hover:-translate-y-[1px]"
        >
          {lang === "ar" ? "رجوع" : lang === "ku" ? "گەڕانەوە" : "Back"}
        </Link>
      </div>

      {/* Desktop/Tablet: Back beside cylinder */}
      <div className="hidden md:block">
        <Link
          href={
            brand === "alen"
              ? `/?lang=${lang}#products`
              : `/brand/${brand}/products?lang=${lang}`
          }
          className="pointer-events-auto rounded-full border bg-white/90 px-4 py-1.5 text-[13px] font-bold text-zinc-500 hover:bg-white shadow-sm transition active:scale-95 hover:-translate-y-[1px]"
        >
          {lang === "ar" ? "رجوع" : lang === "ku" ? "گەڕانەوە" : "Back"}
        </Link>
      </div>
    </>
  ) : null}

  <div className="flex-1 min-w-0">
    <CategoryCylinder
      items={cylinderItems}
      dir="ltr"
      activeSlug={activeSlug}
      onChange={(slug) => {
        if (slug === activeSlug) return;

        if (isTouchRef.current) {
          if (touchSetTimerRef.current) clearTimeout(touchSetTimerRef.current);
          touchSetTimerRef.current = setTimeout(() => {
            setActiveSlug((prev) => (prev === slug ? prev : slug));
          }, 120);
          return;
        }

        onActiveChange(slug);
      }}
      hrefBase={`/brand/${brand}/products/${category}`}
    />
  </div>
</div>
</div>

         <div
  dir="ltr"
  className={`grid grid-cols-1 ${
    items.length === 2
      ? "md:flex md:justify-center"
      : "alen-laptop-grid-3 md:grid-cols-3 max-w-[1100px] 2xl:max-w-[1400px]"
  } gap-3 md:gap-4 lg:gap-4 xl:gap-4 mx-auto`}
>
            {items.map((p) => {
              const label = pickLang(p.title, lang);
              const isActive = activeSlug === p.slug;

              return (
                <motion.button
                  key={p.slug}
                  type="button"
                  onClick={() => goPackaging(p.slug)}
                  onMouseEnter={() => onActiveChange(p.slug)}
                  ref={(node) => {
                    if (node) cardsRef.current.set(p.slug, node);
                    else cardsRef.current.delete(p.slug);
                  }}
                  whileHover={{
                    y: -8,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  animate={
                    isActive
                      ? { y: -10, scale: 0.98 }
                      : { y: 0, scale: 0.95 }
                  }
                  className={`text-left w-full ${items.length === 2 ? "md:w-[450px] md:flex-none" : ""}`}
                >
                  <div
                    className={`
                      group relative overflow-hidden rounded-3xl
                      group-hover:border-black/20
                      bg-white border border-black/10
                      transition-all duration-300
                      shadow-[0_18px_35px_-28px_rgba(0,0,0,0.65)]
                      hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.75)]
                      hover:shadow-[0_40px_80px_-35px_rgba(0,0,0,0.9)]
                      hover:-translate-y-1
                      border-b-[6px] border-b-yellow-400
                      ${isActive ? "shadow-[0_35px_70px_-35px_rgba(0,0,0,0.85)]" : ""}
                    `}
                  >
                    <div className="relative bg-zinc-200 overflow-hidden aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]">
                      <img
                        src={p.image || p.heroImage || "/fallback.png"}
                        alt={label}
                        className="absolute inset-0 w-full h-full object-contain p-6
                                   transition-transform duration-500 group-hover:scale-110"
                        draggable="false"
                      />
                      <div className="absolute inset-0 bg-black/[0.04] group-hover:bg-black/[0.08] transition-all duration-300" />
                    </div>

                    <div className="px-5 py-4 lg:px-4 lg:py-3">
                      <div className="flex items-center gap-2">
                        <div className="font-black text-zinc-600 text-sm truncate group-hover:text-black transition-colors">
                          {label}
                        </div>
                        <span className="font-extrabold text-zinc-500">→</span>
                      </div>

                      <div
                        className={`
                          mt-2 h-[2.5px] w-0 rounded-full
                          bg-gradient-to-r from-transparent via-yellow-400/90 to-transparent
                          transition-all duration-300
                          ${isActive ? "w-20" : "group-hover:w-12"}
                        `}
                      />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="alen-laptop-wrap-1100 mt-10 max-w-[1100px] 2xl:max-w-[1400px] mx-auto flex justify-start">
            <Link
              href={
                brand === "alen"
                  ? `/?lang=${lang}#products`
                  : `/brand/${brand}/products?lang=${lang}`
              }
              className="rounded-full border bg-white/90 px-8 py-3 text-sm font-bold text-zinc-500 hover:bg-white shadow-sm transition-transform active:scale-95"
            >
              {lang === "ar" ? "رجوع" : lang === "ku" ? "گەڕانەوە" : "Back"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}