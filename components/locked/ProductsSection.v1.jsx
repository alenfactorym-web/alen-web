"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MotionTitle, MotionSubtitle, MotionArc } from "@/components/ui/MotionText";

const CATEGORIES = [
  {
    slug: "spices",
    image: "/products/categories/spices.webp",
    title: { en: "Spices", ar: "البهارات", ku: "بەهارات" },
  },
  {
    slug: "powder",
    image: "/products/categories/powder.webp",
    title: { en: "Powder", ar: "باودر", ku: "پاودر" },
  },
  {
    slug: "pickles",
    image: "/products/categories/pickles.webp",
    title: { en: "Pickles", ar: "مخللات", ku: "ترشیەکان" },
  },
  {
    slug: "breakfast",
    image: "/products/categories/breakfast.webp",
    title: { en: "Breakfast", ar: "الفطور", ku: "نانی بەیانیان" },
  },
  {
    slug: "sauce-ketchup",
    image: "/products/categories/sauce-ketchup.webp",
    title: { en: "Sauce & Ketchup", ar: "صلصات و كاتشب", ku: "سۆس و کەتچاپ" },
  },
  {
    slug: "bouillon-soup",
    image: "/products/categories/bouillon-soup.webp",
    title: { en: "Bouillon & Soup", ar: "مرقة وشوربة", ku: "ماجی هاڕاو & شوربا" },
  },
  {
    slug: "liquids",
    image: "/products/categories/liquids.webp",
    title: { en: "Liquids", ar: "السوائل", ku: "شلەمەنیەکان" },
  },
  {
    slug: "salt-vinegar-sumac",
    image: "/products/categories/vinegar.webp",
    title: { en: "Salt & Vinegar & Sumac", ar: "ملح وخل وسماق", ku: "خوێ/سرکە/سماق" },
  },
  {
    slug: "pasta-assistants",
    image: "/products/categories/pasta-assistants.webp",
    title: { en: "Pasta Assistants", ar: "مساعد حلويات", ku: "یاریدەدەری شیرینی" },
  },
  {
    slug: "tissue",
    image: "/products/categories/tissue.webp",
    title: { en: "Tissue", ar: "مناديل", ku: "کلێنکس" },
  },
  {
    slug: "chips",
    image: "/products/categories/chips.webp",
    title: { en: "Chips", ar: "شيبس", ku: "چیپس" },
  },
];

function pickLang(obj, lang) {
  if (!obj) return "";
  if (lang === "ar") return obj.ar || obj.en || "";
  if (lang === "ku") return obj.ku || obj.en || "";
  return obj.en || "";
}

export default function ProductsSectionV1({ t, lang }) {
  // ✅ فونت EN هم مثل Hero (AvantGarde) — باید کلاس font-en-title رو تو global.css داشته باشی
  const uiFont =
    lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "font-en-title";

  const isRTL = lang === "ar" || lang === "ku";

  const sectionTitle =
    lang === "ar" ? "المنتجات" : lang === "ku" ? "بەرهەمەکان" : "Products";

  const sectionSub =
    lang === "ar"
      ? "اختر فئة المنتجات الخاصة بـ ALEN"
      : lang === "ku"
      ? "پۆلی بەرهەمەکانی ALEN هەڵبژێرە"
      : "Browse ALEN product categories.";

  const cta =
    lang === "ar" ? "عرض المنتجات" : lang === "ku" ? "بینینی بەرهەمەکان" : "View products";

  // ✅ EN حرف‌به‌حرف | AR/KU همون block (خراب نشه)
  const revealMode = lang === "en" ? "chars" : "block";

  // ✅ ریپلی روی اسکرول + وقتی زبان عوض شد
  const resetKey = `products-${lang}`;

  return (
    <section className={`relative py-24 bg-transparent overflow-hidden isolate ${uiFont}`} id="products">
      <div className="relative z-10 max-w-7xl mx-auto px-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-10">
          <div className="w-full text-center">
            <MotionTitle
              as="h2"
              className="text-4xl md:text-5xl font-black text-zinc-500"
              reveal={revealMode}
              effect="mask"
              stagger={lang === "en" ? 0.045 : 0}
              delay={0.03}
              y={20}
              blur={8}
              amount={0.85}
              once={false}      // ✅ با اسکرول دوباره اجرا
              duration={0.95}
              resetKey={`${resetKey}-title`}
            >
              {sectionTitle}
            </MotionTitle>

            {/* ✅ کمان زرد هم‌ریتم با تیتر */}
            <div className="mx-auto mt-3 w-[180px] h-[18px]">
              <MotionArc
                className="w-full h-full"
                delay={0.18}
                duration={1.05}
                amount={0.85}
                once={false}
                resetKey={`${resetKey}-arc`}
              />
            </div>

            <MotionSubtitle
              as="p"
              className={`mt-3 text-zinc-500 max-w-2xl mx-auto ${
                lang === "en" ? "text-lg md:text-xl" : "text-base md:text-lg"
              }`}
              reveal={revealMode}
              effect="mask"
              stagger={0.04}
                   delay={0.03}
                   y={16}
                   blur={6}
                  amount={0.85}
                 once={false}
                 duration={0.2}

              resetKey={`${resetKey}-sub`}
            >
              {sectionSub}
            </MotionSubtitle>
          </div>
        </div>

        {/* Cards */}
        <div dir="ltr" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((cat) => {
            const label = pickLang(cat.title, lang);

            return (
              <Link key={cat.slug} href="#" className="block" onClick={(e) => e.preventDefault()}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="
                    group relative overflow-hidden rounded-3xl
                    bg-white/95 backdrop-blur-xl border border-black/10
                    shadow-[0_22px_45px_-30px_rgba(0,0,0,0.7)]
                    hover:shadow-[0_35px_70px_-45px_rgba(0,0,0,0.85)]
                    border-b-[8px] border-b-yellow-400
                    transition
                  "
                >
                  {/* Shine */}
                  <span
                    className="
                      pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
                      bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.7)_35%,transparent_70%)]
                      bg-[length:200%_100%]
                      transition-all duration-700
                    "
                  />

                  {/* Image */}
                  <div className="h-40 relative overflow-hidden bg-zinc-200">
                    <img
                      src={cat.image}
                      alt={label}
                      className="absolute inset-0 w-full h-full object-cover"
                      draggable="false"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>

                  {/* Text */}
                  <div className="p-6">
                    <div
                      className={`font-black text-zinc-500 text-[14px] leading-snug ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {label}
                    </div>

                    <div
                      className={`mt-4 inline-flex items-center gap-2 text-[10px] font-bold text-yellow-600 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      {cta}
                      <span className={isRTL ? "rotate-180" : ""}>→</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

