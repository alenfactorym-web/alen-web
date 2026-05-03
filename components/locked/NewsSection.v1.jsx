"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import SectionHeader from "@/components/products/SectionHeader";
import FadeInUp from "@/components/motion/FadeInUp";
import { MotionTitle, MotionSubtitle } from "@/components/ui/MotionText";

export default function NewsSectionV1({ lang }) {
  const uiFont = lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";
  const isRTL = lang === "ar" || lang === "ku";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
   const didAnimateCardsRef = useRef(false);
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => setResetKey((k) => k + 1), [lang]);

  const revealMode = lang === "en" ? "chars" : "block";

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    fetch(`/api/news?lang=${lang}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (!ignore && json?.list) setData(json);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [lang]);

  const list = useMemo(() => (data?.list || []).slice(0, 3), [data]);

  return (
  <section id="news" className={`relative py-24 bg-transparent overflow-hidden isolate ${uiFont}`}>
    <div
      className="relative z-10 w-[min(1500px,96vw)] mx-auto px-[clamp(16px,3vw,56px)]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <FadeInUp>
        <SectionHeader
          resetKey={`news-${lang}-${resetKey}`}
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
              resetKey={`news-title-${lang}-${resetKey}`}
            >
              {lang === "ar" ? "الأخبار" : lang === "ku" ? "هەواڵ" : "News"}
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
              resetKey={`news-sub-${lang}-${resetKey}`}
            >
              {lang === "ar"
                ? "آخر التحديثات والإعلانات"
                : lang === "ku"
                ? "دوایین نوێکاری و ئاگاداریەکان"
                : "Latest updates and announcements."}
            </MotionSubtitle>
          }
        />
      </FadeInUp>

     {loading && !list.length ? (
  <div className="flex justify-center py-20">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400" />
  </div>
) : (

<motion.div
  dir="ltr"
  initial={!didAnimateCardsRef.current && list.length ? "hidden" : false}
  animate={!didAnimateCardsRef.current && !loading && list.length ? "show" : false}
  onAnimationComplete={() => {
    if (!didAnimateCardsRef.current && !loading && list.length) {
      didAnimateCardsRef.current = true;
    }
  }}
  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
  className="
    grid grid-cols-1 md:grid-cols-3
    gap-4 md:gap-4 lg:gap-4 xl:gap-4
    max-w-[1100px] 2xl:max-w-[1400px]
    mx-auto
  "
>            {list.map((n) => (
              <motion.a
                key={n._id || n.slug}
                href={`/news/${n.slug}?lang=${lang}`}
                variants={{
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
}}
          whileHover={{ y: -5, scale: 1.015 }}
whileTap={{ scale: 0.985 }}
transition={{ duration: 0.35 }}
           className="
  group block relative overflow-hidden rounded-3xl transition-all duration-300
  bg-white/95 backdrop-blur-xl border border-black/10
  shadow-[0_18px_40px_-28px_rgba(0,0,0,0.38)]
  hover:shadow-[0_0_0_1px_rgba(250,204,21,0.4),0_30px_70px_-34px_rgba(0,0,0,0.5)]
  border-b-[8px] border-b-yellow-400
"
              >
                <div className="relative overflow-hidden bg-zinc-200 aspect-[16/10]">
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/0 via-white/0 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {n.image ? (
                   <motion.img
  src={n.image}
  alt={n.title}
  className="absolute inset-0 w-full h-full object-cover"
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.35 }}
/>
                  ) : (
                    <div className="absolute inset-0 bg-zinc-300" />
                  )}
                </div>

                <div className="p-6">
                  <div
                    className={`font-black text-zinc-500 text-[14px] leading-snug h-[40px] overflow-hidden ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {n.title}
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}

        <div
  className={`
    mt-10
    max-w-[1100px] 2xl:max-w-[1400px]
    mx-auto
    flex
    ${isRTL ? "justify-start" : "justify-end"}
    px-2 lg:px-0
  `}
>
          <a
            href={`/news?lang=${lang}`}
            className="
              inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black
              bg-black/5 text-zinc-500 border border-black/10 backdrop-blur-md
              hover:bg-black/10 transition shadow-xl whitespace-nowrap
            "
          >
            {lang === "ar" ? "كل الأخبار" : lang === "ku" ? "هەموو هەواڵ" : "All News"}
            <span className={isRTL ? "rotate-180" : ""}>→</span>
          </a>
        </div>

        <div className="mt-14" />
      </div>
    </section>
  );
}

