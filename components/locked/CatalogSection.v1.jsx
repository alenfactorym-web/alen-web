"use client";

/**
 * CatalogSectionV1
 * - Header uses MotionTitle/MotionSubtitle
 * - Catalog card names stay EN
 * - Download button font locked to EN
 * - Reads directly from Sanity
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/products/SectionHeader";
import FadeInUp from "@/components/motion/FadeInUp";
import { MotionTitle, MotionSubtitle } from "@/components/ui/MotionText";

export default function CatalogSectionV1({ t, lang }) {
  const uiFont = lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";
  const isRTL = lang === "ar" || lang === "ku";

  const [catalogList, setCatalogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    setResetKey((k) => k + 1);
  }, [lang]);

  useEffect(() => {
    let ignore = false;

    async function loadCatalogs() {
      try {
        setLoading(true);
        const res = await fetch("/api/catalogs", { cache: "no-store" });
        const data = await res.json();

        if (!ignore) {
          setCatalogList(Array.isArray(data?.list) ? data.list : []);
        }
      } catch {
        if (!ignore) {
          setCatalogList([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCatalogs();

    return () => {
      ignore = true;
    };
  }, []);

  const revealMode = lang === "en" ? "chars" : "block";
  const headerKey = `catalog-${lang}-${resetKey}`;

  const EN_LOCK =
    "font-en-body !text-[12px] sm:!text-[12.5px] md:!text-[13px] !font-semibold tracking-tight [font-variant-ligatures:none]";

  if (!loading && !catalogList.length) {
    return null;
  }

  return (
    <section
      id="catalog"
      className={`relative isolate overflow-hidden bg-transparent pt-0 pb-0 ${uiFont}`}
    >
      <div
        className="relative z-10 w-[min(1500px,96vw)] mx-auto px-[clamp(16px,3vw,56px)] mt-16 mb-24"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <FadeInUp>
          <SectionHeader
            resetKey={headerKey}
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
                resetKey={`catalog-title-${headerKey}`}
              >
                {lang === "ar" ? "الكتالوج" : lang === "ku" ? "کاتەلۆگ" : "Catalog"}
              </MotionTitle>
            }
            subtitle={
              <MotionSubtitle
                as="span"
                className="inline-block"
                reveal={revealMode}
                effect="mask"
                stagger={lang === "en" ? 0.04 : 0}
                delay={0.08}
                y={16}
                blur={6}
                amount={0.85}
                once={false}
                duration={0.75}
                resetKey={`catalog-sub-${headerKey}`}
              >
                {lang === "ar"
                  ? "قم بتنزيل كتالوجات العلامات التجارية"
                  : lang === "ku"
                  ? "کاتەلۆگەکانی براندەکان دابەزێنە"
                  : "Download our brand catalogs."}
              </MotionSubtitle>
            }
          />
        </FadeInUp>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-yellow-400" />
          </div>
        ) : (
          <div
            dir="ltr"
            className="
              grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5
              gap-4
              max-w-[1100px] 2xl:max-w-[1400px]
              mx-auto
            "
          >
            {catalogList.map((c) => (
              <motion.div
                key={c._id}
                whileHover={{ y: -5, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.22 }}
                className="
                  group relative w-full max-w-[250px] mx-auto overflow-hidden rounded-3xl
                  border border-black/10 border-b-[6px] border-b-yellow-400
                  bg-white/90 backdrop-blur-xl
                  shadow-[0_14px_34px_-24px_rgba(0,0,0,0.28)]
                  hover:shadow-[0_22px_50px_-28px_rgba(0,0,0,0.38)]
                  transition-all duration-300
                "
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                  {c.cover ? (
                    <motion.img
  src={c.cover}
  alt={c.title || "Catalog"}
  className="absolute inset-0 h-full w-full object-cover"
  whileHover={{ scale: 1.04 }}
  transition={{ duration: 0.35 }}
  draggable="false"
/>
                  ) : (
                    <div className="absolute inset-0 bg-zinc-200" />
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 p-4" dir="ltr">
                  <div className={`${EN_LOCK} text-[11px] leading-tight text-zinc-500`}>
                    {c.title || "CATALOG"}
                  </div>

                  <a
  href={`/api/catalogs/download?file=${encodeURIComponent(
    c.file
  )}&name=${encodeURIComponent(c.title || "catalog")}`}
  className={`
    ${EN_LOCK}
    px-3 py-1.5 rounded-full text-[11px]
    bg-yellow-400 text-black
    shadow-[0_8px_18px_-8px_rgba(0,0,0,0.4)]
    hover:bg-yellow-500 hover:shadow-[0_12px_26px_-10px_rgba(0,0,0,0.5)]
    active:scale-95
    transition-all duration-200
    whitespace-nowrap
  `}
>
                    {t?.download || "Download"}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div
        id="catalogEnd"
        className="relative flex h-8 w-full items-center justify-center overflow-hidden bg-yellow-500 md:h-10"
      />
    </section>
  );
}

