"use client";

import AlshafiSectionHeading from "@/components/brands/alshafi/shared/AlshafiSectionHeading";
import styles from "./AlshafiSideIntro.module.css";

export default function AlshafiSideIntro({
  lang = "en",
  variant = "default",
  eyebrow = "EXPLORE",
  titleTop = "ALSHAFI",
  titleBottom = "SECTION",
  desc = "",
  features = [],
  iconSrc = "/alshafi-category-pics/A-spices-vector-001.webp",
  iconAlt = "",
}) {
  const safeLang = (lang || "en").toLowerCase();
  const isRTL = safeLang === "ar" || safeLang === "ku";

  return (
    <aside
      className={`${styles.root} ${styles[variant] || ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={styles.headingWrap}>
        <AlshafiSectionHeading
          eyebrow={eyebrow}
          titleTop={titleTop}
          bottomTitle={titleBottom}
          desc={desc}
          lang={safeLang}
          animateLetters={safeLang === "en"}
        />
      </div>

      {iconSrc ? (
        <img
          src={iconSrc}
          alt={iconAlt}
          className={styles.icon}
          draggable="false"
        />
      ) : null}

      {features.length > 0 ? (
        <div className={styles.features}>
          {features.map((item, index) => (
            <div key={index} className={styles.featureItem}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      ) : null}
    </aside>
  );
}