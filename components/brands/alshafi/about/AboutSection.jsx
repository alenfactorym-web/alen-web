"use client";

import { useEffect, useState } from "react";
import styles from "./AboutSection.module.css";
import AlshafiSideIntro from "@/components/brands/alshafi/shared/AlshafiSideIntro";
import AlshafiSectionWatermark from "@/components/brands/alshafi/shared/AlshafiSectionWatermark";

export default function AlshafiAboutSection({ lang = "en" }) {
  const safeLang = (lang || "en").toLowerCase();
  const uiFont =
    safeLang === "ar" ? "font-ar-title" : safeLang === "ku" ? "ku-title" : "";

  const isRTL = safeLang === "ar" || safeLang === "ku";
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadAbout() {
      try {
        const res = await fetch("/api/about", { cache: "no-store" });
        const data = await res.json();

        if (!ignore && data?.item) {
          setAboutData(data.item);
        }
      } catch {
        // keep fallback content
      }
    }

    loadAbout();

    return () => {
      ignore = true;
    };
  }, []);

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

  const mainImage = aboutData?.mainImage || "/fallback.png";

  const cards = [
  {
    img: aboutData?.qualityImage || "/fallback.png",
    imgSquare: aboutData?.qualityImageSquare || aboutData?.qualityImage || "/fallback.png",
  },
  {
    img: aboutData?.productionImage || "/fallback.png",
    imgSquare: aboutData?.productionImageSquare || aboutData?.productionImage || "/fallback.png",
  },
  {
    img: aboutData?.distributionImage || "/fallback.png",
    imgSquare: aboutData?.distributionImageSquare || aboutData?.distributionImage || "/fallback.png",
  },
];

  function ThemeCard({ children, className = "" }) {
    return <div className={`group ${styles.card} ${className}`}>{children}</div>;
  }

  return (
    <section id="about" className={`${styles.section} ${uiFont}`}>
      <div className={styles.layout} dir="ltr">
  <AlshafiSectionWatermark
    type="factory"
    className="alshafi-about-watermark"
  />

  <div className={styles.contentGrid}>
<AlshafiSideIntro
  lang={safeLang}
  variant="about"
  iconSrc=""
  eyebrow={              safeLang === "ar"
                ? "اكتشف"
                : safeLang === "ku"
                ? "بناسە"
                : "DISCOVER"
            }
           titleTop={
  safeLang === "ar"
    ? "الشافي"
    : safeLang === "ku"
    ? "ئەلشافی"
    : "ALSHAFI"
}
            titleBottom={
              safeLang === "ar"
                ? "من نحن"
                : safeLang === "ku"
                ? "دەربارە"
                : "ABOUT"
            }
            desc={
              safeLang === "ar"
                ? "نفس الجودة التي تعرفونها من عائلة ئالين، بروح الشافي الخاصة"
                : safeLang === "ku"
                ? "هەمان کوالیتیی ناسراوی خێزانی ئالین، بە ڕۆح و تایبەتمەندییەکانی ئەلشافی"
                : "The quality you know from the Alen family, reimagined with Alshafi’s distinctive spirit."
            }
features={[
  {
    title:
      safeLang === "ar"
        ? "جودة موثوقة"
        : safeLang === "ku"
        ? "کوالیتییەکی جێی متمانە"
        : "PREMIUM QUALITY",
    desc:
      safeLang === "ar"
        ? "اختيار دقيق للمكونات"
        : safeLang === "ku"
        ? "هەڵبژاردنی وردی پێکهاتەکانی بەرهەمەکانمان"
        : "Carefully selected ingredients.",
  },
  {
    title:
      safeLang === "ar"
        ? "طبيعي و أصيل"
        : safeLang === "ku"
        ? "سروشتی و ڕەسەن"
        : "NATURAL & AUTHENTIC",
    desc:
      safeLang === "ar"
        ? "نكهات مميزة تعكس هوية العلامة التجارية"
        : safeLang === "ku"
        ? "تامێکی جیاواز، ڕەنگدانەوەی ناسنامەی براندەکەمان."
        : "Authentic taste made for the brand.",
  },
]}
          />

          <div className={styles.mediaColumn}>
            <ThemeCard className={styles.heroCard}>
              <div className={styles.heroImage}>
                <img
                  src={mainImage}
                  alt="Main"
                  className={styles.heroImageElement}
                  draggable="false"
                />
              </div>
            </ThemeCard>

            <div className={styles.grid}>
              {cards.map((c, i) => (
                <ThemeCard key={i}>
                  <div className={styles.gridImage}>
                    <picture>
                      <source
                        media="(orientation: portrait) and (min-width: 768px) and (max-width: 1023px)"
                        srcSet={c.imgSquare}
                      />
                      <source
                        media="(orientation: landscape) and (max-width: 1023px)"
                        srcSet={c.imgSquare}
                      />
                      <source media="(max-width: 420px)" srcSet={c.imgSquare} />

                      <img
                        src={c.img}
                        alt=""
                        className={styles.gridImageElement}
                        draggable="false"
                      />
                    </picture>
                  </div>
                </ThemeCard>
              ))}
            </div>

<div
  className={`${styles.text} ${getBodyClass()}`}
  dir={isRTL ? "rtl" : "ltr"}
>
  <p>{body}</p>
</div>          </div>
        </div>
      </div>
    </section>
  );
}