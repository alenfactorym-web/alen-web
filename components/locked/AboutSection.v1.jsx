"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SectionHeader from "@/components/products/SectionHeader";
import { MotionTitle, MotionSubtitle } from "@/components/ui/MotionText";

export default function AboutSectionV1({ lang = "en" }) {
  const safeLang = (lang || "en").toLowerCase();
  const uiFont = safeLang === "ar" ? "font-ar-title" : safeLang === "ku" ? "ku-title" : "";
  const isRTL = safeLang === "ar" || safeLang === "ku";
  const [aboutData, setAboutData] = useState(null);

  // ✅ برای اینکه وقتی زبان عوض شد موشن‌ها دوباره اجرا بشن
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    setResetKey((k) => k + 1);
  }, [safeLang]);
  useEffect(() => {
    let ignore = false;

    async function loadAbout() {
      try {
        const res = await fetch("/api/about", { cache: "no-store" });
        const data = await res.json();

        if (!ignore && data?.item) {
          setAboutData(data.item);
        }
      } catch {}
    }

    loadAbout();

    return () => {
      ignore = true;
    };
  }, []);
  // ✅ EN: chars | AR/KU: block
  const revealMode = safeLang === "en" ? "chars" : "block";

  // ✅ تایم کندتر مثل بقیه سکشن‌ها
  const titleStagger = safeLang === "en" ? 0.085 : 0;
  const subStagger = safeLang === "en" ? 0.045 : 0;

    const title =
    (aboutData?.title &&
      (safeLang === "ar"
        ? aboutData.title.ar || aboutData.title.en
        : safeLang === "ku"
        ? aboutData.title.ku || aboutData.title.en
        : aboutData.title.en)) ||
    (safeLang === "ar" ? "من نحن" : safeLang === "ku" ? "دەربارەی ئێمە" : "About");

   const subtitle =
    (aboutData?.subtitle &&
      (safeLang === "ar"
        ? aboutData.subtitle.ar || aboutData.subtitle.en
        : safeLang === "ku"
        ? aboutData.subtitle.ku || aboutData.subtitle.en
        : aboutData.subtitle.en)) ||
    (safeLang === "ar" ? "عائلة ئالين" : safeLang === "ku" ? "خانەوادەی ئالین" : "Alen Family");

  const getBodyClass = () => {
    if (safeLang === "ar") return "font-ar-body";
    if (safeLang === "ku") return "ku-body";
    return "font-en-body";
  };

    const body =
    (aboutData?.body &&
      (safeLang === "ar"
        ? aboutData.body.ar || aboutData.body.en
        : safeLang === "ku"
        ? aboutData.body.ku || aboutData.body.en
        : aboutData.body.en)) ||
    (safeLang === "ar"
      ? "نحن في عائلة ئالين نجتذب أفضل الخبراء من البلدان الأخرى ونستخدم أفضل المواد الخام في العالم للحصول على أفضل أنواع الطعام..."
      : safeLang === "ku"
      ? "ئێمە لە بنەماڵەی ئالين باشترین کەسانی پسپۆڕ لە وڵاتانی دیکەوە ڕادەکێشین و باشترین کەرەستەی خاو لە جیهان بەکاردەهێنین..."
      : "We in the Alen family attract the best experts from other countries and use the best raw materials in the world...");

    const mainImage = aboutData?.mainImage || "/about/main.webp";

   const cards = [
    {
      img: aboutData?.qualityImage || "/about/quality.webp",
      imgSquare: aboutData?.qualityImageSquare || "/about/quality-square.webp",
    },
    {
      img: aboutData?.productionImage || "/about/production.webp",
      imgSquare: aboutData?.productionImageSquare || "/about/production-square.webp",
    },
    {
      img: aboutData?.distributionImage || "/about/distribution.webp",
      imgSquare: aboutData?.distributionImageSquare || "/about/distribution-square.webp",
    },
  ];

  function ThemeCard({ children, className = "" }) {
    return (
      <div
        className={[
          "group relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-black/10 shadow-[0_22px_45px_-30px_rgba(0,0,0,0.7)] border-b-[6px] 2xl:border-b-[8px] border-b-yellow-400 transition",
          className,
        ].join(" ")}
      >
        {children}
      </div>
    );
  }

  return (
    <section
      id="about"
      className={`relative py-16 md:py-24 min-h-screen bg-transparent overflow-hidden isolate ${uiFont}`}
    >
      {/* Pattern Overlay */}
     
      <div
  className="w-[min(1500px,96vw)] mx-auto px-[clamp(16px,3vw,56px)] mb-24 mt-16 relative z-10"
  dir={isRTL ? "rtl" : "ltr"}
>
        {/* ✅ Header (Motion + Arc via SectionHeader) */}
        <SectionHeader
          resetKey={`about-${safeLang}-${resetKey}`}
          title={
            <MotionTitle
              as="span"
              className="inline-block text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-zinc-500"
              reveal={revealMode}
              effect="mask"
              stagger={lang === "en" ? 0.045 : 0}
              delay={0.03}
              y={20}
              blur={8}
              amount={0.85}
              once={false}
              duration={0.95}
              resetKey={`about-title-${safeLang}-${resetKey}`}
            >
              {title}
            </MotionTitle>
          }
          subtitle={
            <MotionSubtitle
              as="span"
              className={`inline-block ${safeLang === "en" ? "text-lg md:text-xl" : "text-base md:text-lg"}`}
              reveal={revealMode}
              effect="mask"
              stagger={0.04}
                    delay={0.03}
                    y={16}
                    blur={6}
                    amount={0.85}
                   once={false}
                   duration={0.2}
              resetKey={`about-sub-${safeLang}-${resetKey}`}
            >
              {subtitle}
            </MotionSubtitle>
          }
        />

        {/* Hero Image */}
        <ThemeCard className="max-w-[1100px] 2xl:max-w-[1400px] mx-auto">
          <div className="relative h-[200px] sm:h-[280px] md:h-[340px] lg:h-[380px] 2xl:h-[450px] bg-zinc-200 overflow-hidden">
            <img
              src={mainImage}
              alt="Main"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              draggable="false"
            />
          </div>
        </ThemeCard>

        {/* Grid Cards */}
        <div
  className="
    mt-6
    grid grid-cols-1 sm:grid-cols-3
    gap-4 md:gap-4 lg:gap-4 xl:gap-4
    max-w-[1100px] 2xl:max-w-[1400px]
    mx-auto
    items-start
  "
>
          {cards.map((c, i) => (
            <ThemeCard key={i}>
             <div className="relative h-[150px] sm:h-[170px] md:h-[180px] 2xl:h-[200px] bg-zinc-100 overflow-hidden">
                <picture>
                  {/* ✅ Tablet Portrait: مربع */}
                  <source
                    media="(orientation: portrait) and (min-width: 768px) and (max-width: 1023px)"
                    srcSet={c.imgSquare}
                  />
                  {/* ✅ Mobile/Tablet Landscape */}
                  <source media="(orientation: landscape) and (max-width: 1023px)" srcSet={c.imgSquare} />
                  {/* ✅ Small phones */}
                  <source media="(max-width: 420px)" srcSet={c.imgSquare} />

                  {/* ✅ Default */}
                  <img
                    src={c.img}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    draggable="false"
                  />
                </picture>
              </div>
            </ThemeCard>
          ))}
        </div>

        {/* Text Content */}
        <div
  className={`
    mt-10
    max-w-[1100px] 2xl:max-w-[1400px]
    mx-auto
    px-2 lg:px-0
    text-justify leading-relaxed
    ${getBodyClass()}
  `}
>
          <p className="text-zinc-500">{body}</p>
        </div>

        {/* Back Button */}
        <div className="mt-10 max-w-[1100px] 2xl:max-w-[1400px] mx-auto px-2 lg:px-0">
          <Link
            href={`/?lang=${safeLang}`}
            className="inline-block rounded-full border bg-white/90 px-8 py-3 text-sm font-bold text-zinc-500 hover:bg-white shadow-md transition-all active:scale-95"
          >
            {safeLang === "ar" ? "رجوع" : safeLang === "ku" ? "گەڕانەوە" : "Back"}
          </Link>
        </div>
      </div>
    </section>
  );
}

