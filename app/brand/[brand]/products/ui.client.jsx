"use client";
import Image from "next/image";
import { useMemo, useRef, useState, useEffect } from "react";
import SectionHeader from "@/components/products/SectionHeader";
import CategoryCylinder from "@/components/products/CategoryCylinder";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { motion, useReducedMotion } from "framer-motion";
import { MotionTitle, MotionSubtitle } from "@/components/ui/MotionText";
import { getBrandTheme } from "@/lib/brandTheme";
import AlshafiProductsClient from "@/components/brands/alshafi/AlshafiProductsClient";

function pickLang(obj, lang) {
  if (!obj) return "";
  if (lang === "ar") return obj.ar || obj.en || "";
  if (lang === "ku") return obj.ku || obj.en || "";
  return obj.en || "";
}

function CategoryCardsSkeleton() {
  return (
    <div
      dir="ltr"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7 lg:gap-8"
      style={
        typeof window !== "undefined"
          ? window.innerWidth >= 1024 && window.innerWidth < 1440
            ? {
                gridTemplateColumns: "repeat(4, 180px)",
                justifyContent: "center",
              }
            : window.innerWidth >= 1920
              ? {
                  gridTemplateColumns: "repeat(4, 1fr)",
                  maxWidth: "1500px",
                  margin: "0 auto",
                }
              : undefined
          : undefined
      }
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="
            overflow-hidden rounded-2xl
            bg-white border border-black/10
            border-b-[8px] border-b-yellow-400
            shadow-[0_18px_35px_-25px_rgba(0,0,0,0.5)]
            animate-pulse
          "
        >
          <div className="h-[120px] sm:h-[145px] md:h-[175px] bg-zinc-200/80" />
          <div className="px-5 py-3">
            <div className="h-4 w-24 rounded bg-zinc-200/80" />
            <div className="mt-2 h-[2.5px] w-12 rounded bg-zinc-200/80" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryCard({
  cat,
  brand,
  lang,
  isActive,
  registerRef,
  onHoverCard,
}) {  const label = pickLang(cat.title, lang);
  const prefersReducedMotion = useReducedMotion();
    const theme = getBrandTheme(brand);

  
  return (
    <motion.a
  style={{
  borderBottomColor: isActive ? theme.accent : theme.cardAccent,
}}
  key={cat.slug}
  href={`/brand/${brand}/products/${cat.slug}?lang=${lang}`}
  ref={registerRef}
  onMouseEnter={() => onHoverCard?.(cat.slug)}
  onFocus={() => onHoverCard?.(cat.slug)}
  whileHover={prefersReducedMotion ? { y: -6 } : { y: -6, scale: 1 }}
  whileTap={{ scale: 0.985 }}
onClick={() => {}}
  animate={{
  scale: isActive ? [1, 1.12, 1.08] : 1,
  y: 0,
}}



  transition={{
  duration: isActive ? 0.4 : 0.22,
}}
      className={`
        group block relative isolate overflow-hidden rounded-3xl
        bg-white border border-black/10
        transition-all duration-300
        hover:border-black/20
        shadow-[0_18px_40px_-28px_rgba(0,0,0,0.38)]
        hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_30px_70px_-34px_rgba(0,0,0,0.5)]
       ${isActive
  ? "border-b-[8px] border-b-zinc-300 bg-white shadow-[0_28px_60px_-28px_rgba(0,0,0,0.42)] ring-1 ring-black/5"
  : "border-b-[8px] bg-white/95"}
        scroll-mt-[160px] md:scroll-mt-0
      `}
      
    >
      <div
  className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-500 ${
    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
  }`}
>
  <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-transparent" />
</div>

    <div className="relative h-[190px] sm:h-[220px] md:h-[260px] overflow-hidden">
  <div className="absolute inset-0 p-4 lg:p-3 xl:p-4">
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
{cat?.image ? (
 <Image
  src={cat.image}
  alt={label}
  fill  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
className="
  object-contain
  scale-[1.1] lg:scale-[0.9] xl:scale-[1.1]
  transition-transform duration-700 ease-out
  group-hover:scale-[1.15] lg:group-hover:scale-[1] xl:group-hover:scale-[1.15]
  transform-gpu
"
   draggable={false}
   data-visualsearch="false"
/>
) : (
  <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-center text-xs font-bold text-zinc-500">
    NO IMAGE
  </div>
)}
  </div>
  </div>

  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-white/95 via-white/92 to-transparent" />

 <div className="pointer-events-none absolute left-1/2 bottom-7 z-0 h-4 w-[42%] -translate-x-1/2 rounded-full bg-black/10 blur-xl" />
</div>

<div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center">
  <div className="flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 backdrop-blur-sm">
    <span className="truncate font-bold text-zinc-600 text-sm sm:text-base tracking-tight">
      {label}
    </span>
   <span
  className={`transition-transform duration-300 group-hover:translate-x-1 ${
    isActive ? "text-zinc-800" : "text-zinc-600"
  }`}
>
  →
</span>
  </div>
</div>
    </motion.a>
  );
}

export default function BrandProductsClient({
  brand = "alen",
  initialCategories = [],
}) {
  if (brand === "alshafi") {
    return (
      <AlshafiProductsClient
        brand={brand}
        initialCategories={initialCategories}
      />
    );
  }

  const { lang } = useLanguage();
  const isRTL = lang === "ar" || lang === "ku";
  const uiFont = lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";
  const revealMode = lang === "en" ? "chars" : "block";
  const resetKey = `products-${brand}-${lang}`;
  const [categories, setCategories] = useState(
    Array.isArray(initialCategories) ? initialCategories : []
  );
  const [loading, setLoading] = useState(false);
  const cardsRef = useRef(new Map());
  const [activeSlug, setActiveSlug] = useState("");
  const isTouchRef = useRef(false);
  const touchSetTimerRef = useRef(null);
    const theme = getBrandTheme(brand);
   
    const slogan = theme.products?.slogan || {
    en: "ALEN THE TITLE OF SUCCESS",
    ar: "ماركة ئالين عنوان النجاح",
    ku: "ئالین ناونیشانی سەرکەوتن",
  };

  useEffect(() => {
    setCategories(Array.isArray(initialCategories) ? initialCategories : []);
    setLoading(false);
  }, [initialCategories]);

 useEffect(() => {
  if (typeof window === "undefined") return;

  const key = `products-scroll-${brand}`;
  const saved = sessionStorage.getItem(key);

  if (saved) {
    const y = parseInt(saved, 10);

    if (!isNaN(y)) {
      window.scrollTo({ top: y, behavior: "auto" });
    }

    sessionStorage.removeItem(key);
  }
}, [brand]);

  const cylinderItems = useMemo(() => {
    return categories.map((c) => ({
      slug: c.slug,
      label: pickLang(c.title, lang),
    }));
  }, [categories, lang]);

  useEffect(() => {
    if (!activeSlug && cylinderItems?.[0]?.slug) {
      setActiveSlug(cylinderItems[0].slug);
    }
  }, [cylinderItems, activeSlug]);

  useEffect(() => {
    return () => {
      if (touchSetTimerRef.current) clearTimeout(touchSetTimerRef.current);
    };
  }, []);

  const onActiveChange = (slug) => {
  setActiveSlug((prev) => (prev === slug ? prev : slug));
};

  return (
   <main className="min-h-screen">

      <section className="alen-products-section relative pt-36 md:pt-40 pb-24 bg-transparent overflow-hidden isolate">

        <div
          className={`relative z-10 w-[min(1500px,96vw)] mx-auto px-[clamp(16px,3vw,56px)] ${uiFont}`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <SectionHeader
            key={`section-header-${brand}-${lang}`}
            resetKey={resetKey}
            titleClassName="text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-500"
            arcClassName="mx-auto mt-2 w-[240px] h-[24px]"
            subtitleClassName="mt-2 text-zinc-500 max-w-2xl mx-auto text-lg md:text-xl"
            once={false}
            amount={0.85}
            title={
              <MotionTitle
                key={`title-${resetKey}`}
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
              >
                {lang === "ar" ? "المنتجات" : lang === "ku" ? "بەرهەمەکان" : "Products"}
              </MotionTitle>
            }
            subtitle={
              <MotionSubtitle
                key={`sub-${resetKey}`}
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
              >
     {theme.products?.subtitle
  ? pickLang(theme.products.subtitle, lang)
  : lang === "ar"
    ? "اختر فئة المنتجات"
    : lang === "ku"
      ? "پۆلی بەرهەمەکان هەڵبژێرە"
      : `Browse ${brand.toUpperCase()} product categories.`}
              </MotionSubtitle>
            }
          />

          {loading ? (
            <>
              <div className="max-w-[92vw] md:max-w-5xl mx-auto mt-6 mb-5 px-1 md:px-0">
                <div className="h-12 rounded-full bg-transparent border-0 shadow-none animate-pulse" />
              </div>

              <div className="mt-2 mb-10 flex flex-col items-center text-center max-w-3xl mx-auto">
                <div className="h-6 w-56 rounded bg-zinc-200/80 animate-pulse" />
                <div className="mt-3 h-4 w-72 rounded bg-zinc-200/80 animate-pulse" />
              </div>

              <CategoryCardsSkeleton />
            </>
          ) : categories.length === 0 ? (
            <div className="max-w-2xl mx-auto mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              No categories found for brand: <b>{brand || "(empty)"}</b>
            </div>
          ) : (
            <>
              <div className="max-w-[92vw] md:max-w-5xl mx-auto mt-6 mb-5 px-1 md:px-0 touch-pan-x overscroll-x-contain">
               {theme.productsNavStyle === "tabs" ? (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {cylinderItems.map((item) => {
      const isActive = activeSlug === item.slug;

      return (
        <button
          key={item.slug}
          type="button"
          onClick={() => onActiveChange(item.slug)}
          className="rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300"
          style={{
            borderColor: isActive ? theme.accent : "rgba(0,0,0,0.12)",
            backgroundColor: isActive ? theme.accent : "rgba(255,255,255,0.85)",
            color: isActive ? "#070707" : theme.muted,
          }}
        >
          {item.label}
        </button>
      );
    })}
  </div>
) : (
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
    hrefBase={`/brand/${brand}/products`}
  />
)}
              </div>

              <div className="-mt-2 mb-6 flex flex-col items-center text-center max-w-3xl mx-auto">
                <MotionSubtitle
                  as="h3"
                  className={`
                    text-base sm:text-lg md:text-2xl
                    text-zinc-500 leading-tight
                    ${lang === "en" ? "font-bold" : ""}
                  `}
                  reveal={lang === "en" ? "chars" : "block"}
                  effect="mask"
                  stagger={lang === "en" ? 0.04 : 0}
                  delay={0.03}
                  y={16}
                  blur={6}
                  amount={0.85}
                  once={false}
                  duration={0.2}
                  resetKey={`products-slogan-${lang}`}
                >
                  {pickLang(slogan, lang)}
                </MotionSubtitle>

               <p
  className={`
    mt-3 text-sm md:text-[20px] leading-2 text-zinc-500
    ${lang === "ar" ? "font-ar-body !text-[13px] md:!text-[19px]" : ""}
    ${lang === "ku" ? "ku-title !text-[13px] md:!text-[17px]" : ""}
  `}
  dir={isRTL ? "rtl" : "ltr"}
>
                  {theme.products?.description
  ? pickLang(theme.products.description, lang)
  : lang === "ar"
    ? "لدى ئالين طعم مفضل للجميع!"
    : lang === "ku"
      ? "ئالێن تامێکی دڵخوازی هەیە بۆ هەموو کەسێک!"
      : "ALEN HAS A FAVORITE TASTE FOR EVERYONE!"}
                </p>
              </div>

             <div
  dir="ltr"
  className="alen-products-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7 lg:gap-8 xl:max-w-[1100px] 2xl:max-w-[1500px] mx-auto"
>
                {categories.map((cat) => {
                  const isActive = activeSlug === cat.slug;

                  return (
                   <CategoryCard
  key={cat.slug}
  cat={cat}
  brand={brand}
  lang={lang}
  isActive={isActive}
  onHoverCard={onActiveChange}
  registerRef={(node) => {
    if (node) cardsRef.current.set(cat.slug, node);
    else cardsRef.current.delete(cat.slug);
  }}
/>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}