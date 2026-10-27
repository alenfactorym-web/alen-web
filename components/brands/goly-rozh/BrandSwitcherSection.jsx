"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import styles from "./BrandSwitcherSection.module.css";
const COPY = {
  en: "EXPLORE OUR BRANDS",
  ar: "اكتشف علاماتنا التجارية",
  ku: "بڕاندەکانمان ببینە",
};

export default function GolyRozhBrandSwitcherSection({
  brands = [],
  activeBrand,
}) {
  const { lang } = useLanguage();

  const currentLang = ["en", "ar", "ku"].includes(lang) ? lang : "en";
  const isRTL = currentLang === "ar" || currentLang === "ku";
  const visibleBrands = brands.filter(
    (brand) => brand?.slug?.current !== activeBrand
  );

  const displayBrands = [...visibleBrands];

  const plusIndex = displayBrands.findIndex(
    (brand) => brand?.slug?.current === "alen-plus"
  );

  const goliIndex = displayBrands.findIndex(
    (brand) => brand?.slug?.current === "goli-alen"
  );

  if (plusIndex !== -1 && goliIndex !== -1) {
    [displayBrands[plusIndex], displayBrands[goliIndex]] = [
      displayBrands[goliIndex],
      displayBrands[plusIndex],
    ];
  }

  if (!displayBrands.length) return null;

  const textFont =
    currentLang === "ar"
      ? "font-ar-title"
      : currentLang === "ku"
        ? "ku-title"
        : "";

  return (
    <section
      id="brands"
      className={styles.section}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={styles.inner}>
        <div className={styles.logos}>
          {displayBrands.map((brand) => {
            const slug = brand?.slug?.current;

            return (
              <Link
                key={slug}
                href={
                  slug === "alen"
                    ? `/?lang=${currentLang}`
                    : `/brand/${slug}?lang=${currentLang}`
                }
                className={styles.logoLink}
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.07 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 18,
                  }}
                  className={styles.logoBox}
                >
                  {brand.logo && (
                    <img
                      src={brand.logo}
                      alt={brand.name || slug}
                      className={`${styles.logo} ${
                        slug === "alen"
                          ? styles.alenLogo
                          : slug === "alshafi"
                            ? styles.alshafiLogo
                            : styles.defaultLogo
                      }`}
                      draggable="false"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        <div className={styles.divider} />

       <div className={styles.marquee}>
  <div className={styles.marqueeTrack}>
    <span className={`${styles.marqueeText} ${textFont}`}>
      • {COPY[currentLang]} •
    </span>
  </div>
</div>
      </div>
    </section>
  );
}