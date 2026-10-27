"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import GolyRozhReveal from "../shared/GolyRozhReveal";
import styles from "./ProductsSection.module.css";
import ProductsCurve from "./ProductsCurve";

const COPY = {
  en: {
    eyebrow: "EXPLORE",
    titleTop: "GOLY ROZH",
    titleBottom: "COLLECTION",
    description:
      "Discover our product categories created with trusted quality and authentic flavor.",
  },

  ar: {
    eyebrow: "استكشف",
    titleTop: "GOLY ROZH",
    titleBottom: "المجموعة",
    description:
      "اكتشف فئات منتجاتنا المصنوعة بجودة موثوقة ونكهة أصيلة.",
  },

  ku: {
    eyebrow: "بگەڕێ",
    titleTop: "گولی ڕۆژ",
    titleBottom: "کۆمەڵە",
    description:
      "پۆلەکانی بەرهەمەکانمان بدۆزەرەوە، بە کوالیتیی متمانەپێکراو و تامێکی ڕەسەن.",
  },
};

function pickLang(value, lang) {
  if (!value) return "";

  if (lang === "ar") {
    return value.ar || value.en || "";
  }

  if (lang === "ku") {
    return value.ku || value.en || "";
  }

  return value.en || "";
}

function GolyRozhCategoryIntro({ lang = "en" }) {
  const currentLang = ["en", "ar", "ku"].includes(lang) ? lang : "en";
  const content = COPY[currentLang];

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
<GolyRozhReveal
  key={currentLang}
  className={styles.intro}
  replayKey={currentLang}
>      <p
        className={`${styles.eyebrow} goly-rozh-section-eyebrow ${titleFont}`}
      >
        {content.eyebrow}
      </p>

      <h2 className={styles.title}>
        <span
          className={`goly-rozh-section-top-title ${
            currentLang === "ar" ? "" : titleFont
          }`}
        >
          {content.titleTop}
        </span>

        <span
          className={`goly-rozh-section-bottom-title ${titleFont}`}
        >
          {content.titleBottom}
        </span>
      </h2>

      <p
        className={`${styles.description} goly-rozh-section-desc ${bodyFont}`}
      >
        {content.description}
      </p>
    </GolyRozhReveal>
  );
}

export default function GolyRozhProductsSectionClient({
  brand = "goly-rozh",
  categories = [],
}) {
  const { lang } = useLanguage();

  const currentLang = ["en", "ar", "ku"].includes(lang) ? lang : "en";
  const isRTL = currentLang === "ar" || currentLang === "ku";

  const titleFont =
    currentLang === "ar"
      ? "font-ar-title"
      : currentLang === "ku"
        ? "ku-title"
        : "";

  return (
    <section
      id="products"
      className={styles.productsSection}
      dir={isRTL ? "rtl" : "ltr"}
      data-lang={currentLang}
    >
      <img
        src="/goly-rozh/spices-vector-line-0001.webp"
        alt=""
        className={styles.spicesLineArt}
        aria-hidden="true"
        draggable="false"
      />

      <div className={styles.redArea}>
       <ProductsCurve />

        <GolyRozhCategoryIntro lang={currentLang} />

        <div className={styles.categories}>
          {(Array.isArray(categories) ? categories : []).map((category) => {
            const categoryTitle = pickLang(category.title, currentLang);

            return (
              <Link
                key={category._id}
                href={`/brand/${brand}/products/${category.slug}?lang=${currentLang}`}
                className={styles.categoryCard}
              >
                <div className={styles.categoryCardShell}>
                  <div className={styles.categoryImagePanel}>
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={categoryTitle}
                        className={styles.categoryImage}
                      />
                    ) : (
                      <div className={styles.categoryImageFallback} />
                    )}
                  </div>

                  <div className={styles.categoryLabelBar}>
                    <span
                      className={`${styles.categoryLabel} ${titleFont}`}
                    >
                      {categoryTitle}
                    </span>

                    <span
                      className={styles.categoryArrow}
                      aria-hidden="true"
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
  );
}