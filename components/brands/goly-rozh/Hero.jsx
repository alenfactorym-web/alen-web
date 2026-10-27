"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import HeroCurve from "./HeroCurve";
import HeroChef from "./HeroChef";
import styles from "./Hero.module.css";

const COPY = {
  en: {
    eyebrow: "PREMIUM QUALITY",
    titleTop: "PURE FLAVOR",
    titleBottom: "NATURAL GOODNESS",
    description:
      "Carefully selected products created to bring trusted quality and authentic flavor to every meal.",
    button: "Explore Products",
  },

  ar: {
    eyebrow: "جودة فاخرة",
    titleTop: "نكهة نقية",
    titleBottom: "جودة طبيعية",
    description:
      "منتجات مختارة بعناية لتمنح كل وجبة جودة موثوقة ونكهة أصيلة.",
    button: "استكشف المنتجات",
  },

  ku: {
    eyebrow: "کوالێتی بەرز",
    titleTop: "تامێکی پاک",
    titleBottom: "کوالێتیی سروشتی",
    description:
      "بەرهەمەکانمان بە وردی هەڵبژێردراون بۆ ئەوەی کوالێتیی متمانەپێکراو و تامێکی ڕەسەن ببەخشن.",
    button: "بەرهەمەکان ببینە",
  },
};


export default function GolyRozhHero({
  brand = "goly-rozh",
}) {
  const { lang } = useLanguage();

  const currentLang = ["en", "ar", "ku"].includes(lang) ? lang : "en";
  const content = COPY[currentLang];
  const isRTL = currentLang === "ar" || currentLang === "ku";

  const titleFont =
    currentLang === "ar"
      ? "font-ar-title"
      : currentLang === "ku"
        ? "ku-title"
        : "";

  const bodyFont =
    currentLang === "ar"
      ? "font-ar-body"
      : currentLang === "ku"
        ? "ku-title"
        : "";

return (
  <section
    id="goly-rozh-hero"
    className={styles.hero}
    dir={isRTL ? "rtl" : "ltr"}
    data-lang={currentLang}
  
>
      <div className={styles.redSection}>
        <div className={styles.redPattern} aria-hidden="true" />

        <img
          src="/goly-rozh/background-vector-0001.webp"
          alt=""
          className={styles.farmVector}
          aria-hidden="true"
        />

       <div className={styles.redContent}>
  <p className={`${styles.eyebrow} ${titleFont}`}>
    {content.eyebrow}
  </p>

  <div className={styles.logoWrap}>
    <img
      src="/logos/goly-rozh-logo.webp"
      alt="Goly Rozh"
      className={styles.logo}
    />
  </div>
</div>

<HeroCurve />
</div>


      <div className={styles.whiteSection}>
  <HeroChef replayKey={currentLang} />

 <div className={styles.pepperVisual} aria-hidden="true">
  <img
    src="/goly-rozh/goly-rozh-pepper.webp"
    alt=""
    className={styles.pepperImage}
  />
</div>

<div
  key={currentLang}
  className={styles.mainContent}
>
          <h1 className={`${styles.title} ${titleFont}`}>
  <span className={styles.titleLine}>
    {content.titleTop}
  </span>

  <span className={styles.titleLine}>
    {content.titleBottom}
  </span>
</h1>

          <p className={`${styles.description} ${bodyFont}`}>
            {content.description}
          </p>

          <Link
            href={`/brand/${brand}/products?lang=${currentLang}`}
            className={`${styles.button} ${titleFont}`}
          >
            <span>{content.button}</span>

            <span
              className={isRTL ? styles.arrowRTL : styles.arrow}
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>

        
      </div>
           </section>
  );
}