"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MotionTitle } from "@/components/ui/MotionText";

const brands = [
  { slug: "alshafi", name: "Alshafi", logo: "/logos/alshafi.png", color: "#000000" },
  { slug: "goly-rozh", name: "Goly Rozh", logo: "/logos/golyrozh.png", color: "#800020" },
  { slug: "goli-alen", name: "Goli Alen", logo: "/logos/golialen.png", color: "#2563eb" },
  { slug: "alen-plus", name: "Alen Plus", logo: "/logos/alenplus.png", color: "#60a5fa" },
];

export default function BrandSlider({ t, lang }) {
  const isRTL = lang === "ar" || lang === "ku";
  const uiFont = lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";

  const titleText = t?.brandsTitle || "Our Brands";

  // ✅ ریستِ مطمئن برای وقتی چندبار زبان عوض میشه
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    setResetKey((k) => k + 1);
  }, [lang]);

  // ✅ EN: chars | AR/KU: block (خراب نشه)
  const revealMode = lang === "en" ? "chars" : "block";
  const titleStagger = lang === "en" ? 0.085 : 0;

  return (
    <section className="alen-brands-section relative py-24 overflow-visible">
      {/* Background layers */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[55%] bg-zinc-600" />

        {/* نوار زرد - همون قبلی، دست نمی‌زنیم */}
        <div
          id="brandsYellow"
          className="absolute inset-x-0 top-[55%] -translate-y-1/2 h-[45px] bg-yellow-500"
        />

      </div>

      <div className="relative z-10">
        {/* ✅ Title with SAME MotionText (NO ARC) */}
        <div
          className={`alen-brands-title text-center mb-16 text-zinc-200 ${uiFont}`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <MotionTitle
            as="h2"
            className="text-5xl font-black"
            reveal={revealMode}
            effect="mask"
            stagger={lang === "en" ? 0.045 : 0}
            delay={0.03}
            y={20}
            blur={8}
            amount={0.85}
            once={false}
            duration={0.95}
            resetKey={`brands-title-${lang}-${resetKey}`}
          >
            {titleText}
          </MotionTitle>
        </div>

        <div dir="ltr" className="alen-brands-wrap max-w-[1100px] 2xl:max-w-[1400px] mx-auto px-6">
          {/* ✅ MOBILE ONLY: 4 cards in ONE row (no scroll) */}
          <div className="md:hidden -mx-6 px-4">
            <div className="grid grid-cols-4 gap-2">
              {brands.map((brand) => (
                <Link key={brand.slug} href={`/brand/${brand.slug}`} className="block w-full">
                  <motion.div whileTap={{ scale: 0.98 }} className="relative">
                    <div
                      className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-black/10
shadow-[0_14px_28px_-22px_rgba(0,0,0,0.45)]
transition duration-300 group-hover:shadow-[0_22px_40px_-28px_rgba(0,0,0,0.55)]  
         p-4 lg:p-5 2xl:p-6 text-center border-b-[8px] 2xl:border-b-[12px]
           w-full aspect-[4/3] flex flex-col justify-center items-center"
                      style={{ borderBottomColor: brand.color }}
                    >
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="h-8 w-auto max-w-[92%] mx-auto mb-1 object-contain"
                        draggable="false"
                      />

                      <div className="font-black tracking-tight text-slate-900 text-[10px] leading-tight">
                        {brand.name}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* ✅ DESKTOP/TABLET (md+): EXACTLY your old grid, unchanged */}
          <div className="alen-brands-grid hidden md:grid grid-cols-4 gap-4 lg:gap-6 2xl:gap-10 justify-items-center">
            {brands.map((brand) => (
              <Link key={brand.slug} href={`/brand/${brand.slug}`} className="block w-full">
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 340, damping: 18 }}
                  className="relative group cursor-pointer"
                >
                  <div
                    className="pointer-events-none absolute -inset-3 rounded-[32px] opacity-0 blur-2xl transition duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(700px circle at 30% 15%, ${brand.color}66, transparent 60%)`,
                    }}
                  />

                  <div
                    className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-black/10
                               shadow-[0_14px_28px_-22px_rgba(0,0,0,0.45)]
transition duration-300 group-hover:shadow-[0_22px_40px_-28px_rgba(0,0,0,0.55)]
                               p-6 text-center border-b-[12px]
                               w-full aspect-[4/3] flex flex-col justify-center items-center"
                    style={{ borderBottomColor: brand.color }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.55) 35%, transparent 70%)",
                        transform: "translateX(-30%)",
                      }}
                    />

                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-12 lg:h-14 2xl:h-20 w-auto max-w-[80%] mx-auto mb-3 2xl:mb-4 object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      draggable="false"
                    />

                    <div className="relative inline-block font-black tracking-tight text-slate-900">
                      <span className="relative">{brand.name}</span>
                      <span
                        className="pointer-events-none absolute inset-0 text-transparent bg-clip-text
                                   bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.95),transparent)]
                                   bg-[length:200%_100%] bg-[position:200%_0]
                                   opacity-0 group-hover:opacity-100 group-hover:bg-[position:-200%_0]
                                   transition-[background-position,opacity] duration-700 ease-out font-black tracking-tight"
                      >
                        {brand.name}
                      </span>
                    </div>

                    <div
                      className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                      style={{ boxShadow: `inset 0 0 0 1px ${brand.color}55` }}
                    />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

