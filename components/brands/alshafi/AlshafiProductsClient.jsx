"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import SectionHeader from "@/components/products/SectionHeader";
import { MotionTitle, MotionSubtitle } from "@/components/ui/MotionText";

function pickLang(obj, lang) {
  if (!obj) return "";
  if (lang === "ar") return obj.ar || obj.en || "";
  if (lang === "ku") return obj.ku || obj.en || "";
  return obj.en || "";
}

export default function AlshafiProductsClient({
  brand = "alshafi",
  initialCategories = [],
}) {
  const { lang } = useLanguage();

  const isRTL = lang === "ar" || lang === "ku";

  const uiFont =
    lang === "ar"
      ? "font-ar-title"
      : lang === "ku"
      ? "ku-title"
      : "";

  const revealMode = lang === "en" ? "chars" : "block";

  const [categories, setCategories] = useState(
    Array.isArray(initialCategories) ? initialCategories : []
  );

  const [activeSlug, setActiveSlug] = useState("");

  useEffect(() => {
    setCategories(Array.isArray(initialCategories) ? initialCategories : []);
  }, [initialCategories]);

  const items = useMemo(() => {
    return categories.map((c) => ({
      slug: c.slug,
      label: pickLang(c.title, lang),
      image: c.image,
    }));
  }, [categories, lang]);

  useEffect(() => {
    if (!activeSlug && items?.[0]?.slug) {
      setActiveSlug(items[0].slug);
    }
  }, [items, activeSlug]);

  return (
    <main className={`min-h-screen ${uiFont}`}>
      <section className="relative pt-32 md:pt-40 pb-24 overflow-hidden isolate">
        <div
          className="relative z-10 w-[min(1450px,94vw)] mx-auto"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <SectionHeader
            titleClassName="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#c99a3a]"
            subtitleClassName="mt-2 text-[#c99a3a]/70 max-w-2xl mx-auto text-lg md:text-xl"
            arcClassName="mx-auto mt-2 w-[240px] h-[24px]"
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
              >
                {lang === "ar"
                  ? "منتجات الشافي"
                  : lang === "ku"
                  ? "بەرهەمەکانی الشافی"
                  : "ALSHAFI PRODUCTS"}
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
              >
                {lang === "ar"
                  ? "اختر فئة المنتجات"
                  : lang === "ku"
                  ? "پۆلی بەرهەمەکان هەڵبژێرە"
                  : "Choose product category"}
              </MotionSubtitle>
            }
          />

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6">
            {items.map((cat) => {
              const isActive = activeSlug === cat.slug;

              return (
                <Link
                  key={cat.slug}
                  href={`/brand/${brand}/products/${cat.slug}?lang=${lang}`}
                  onMouseEnter={() => setActiveSlug(cat.slug)}
                  className={`
                    group relative overflow-hidden rounded-[30px]
                    border transition-all duration-500
                    bg-[#080808]/96
                    ${
                      isActive
                        ? "border-[#c99a3a]/70 shadow-[0_0_60px_-25px_rgba(201,154,58,0.45)]"
                        : "border-[#c99a3a]/20 hover:border-[#c99a3a]/45"
                    }
                  `}
                >
                  <div className="relative h-[340px] overflow-hidden">
                    <Image
                      src={cat.image || "/fallback.png"}
                      alt={cat.label}
                      fill
                      className="
                        object-contain p-8
                        transition-transform duration-700
                        group-hover:scale-[1.08]
                      "
                      sizes="(max-width:768px) 100vw, 33vw"
                    />

                    <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent" />

                    <div className="absolute left-1/2 bottom-10 -translate-x-1/2 h-5 w-[44%] rounded-full bg-black/40 blur-2xl" />
                  </div>

                  <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center px-4">
                    <div
                      className={`
                        flex items-center gap-2 rounded-full
                        border px-4 py-2
                        backdrop-blur-xl
                        transition-all duration-300
                        ${
                          isActive
                            ? "border-[#c99a3a]/60 bg-[#111111]/90"
                            : "border-[#c99a3a]/20 bg-black/50"
                        }
                      `}
                    >
                      <span className="font-bold text-[#f3d98a] text-sm md:text-base truncate">
                        {cat.label}
                      </span>

                      <span
                        className={`
                          transition-transform duration-300 text-[#c99a3a]
                          ${isActive ? "translate-x-1" : ""}
                        `}
                      >
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}