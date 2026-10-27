"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

import GolyRozhReveal from "../shared/GolyRozhReveal";
import GolyRozhSectionHeading from "../shared/GolyRozhSectionHeading";

import styles from "./AboutSection.module.css";

const COPY = {
en: {
  eyebrow: "OUR STORY",
  titleTop: "GOLY ROZH",
  titleBottom: "ABOUT",
  desc:
    "Discover the story, values, and quality behind Goly Rozh.",
  body:
    "Goly Rozh brings together trusted quality, authentic flavor, and carefully selected products created for everyday cooking.",

  storyTitle: "OUR STORY",
  storyText:
    "From a passion for taste to a promise of quality. Goly Rozh was born to bring authentic flavor to every kitchen.",

  cardTitles: [
    "QUALITY",
    "IDENTITY",
    "EXPERIENCE",
  ],

  cardTexts: [
    "Carefully selected products with trusted quality and exceptional taste.",
    "Rooted in tradition, authenticity, trust, and the identity of Goly Rozh.",
    "Experience and dedication brought together for everyday cooking.",
  ],
},

 ar: {
  eyebrow: "قصتنا",
  titleTop: "GOLY ROZH",
  titleBottom: "من نحن",
  desc:
    "اكتشف قصة Goly Rozh والقيم والجودة التي تقف خلف منتجاتنا.",
  body:
    "تجمع Goly Rozh بين الجودة الموثوقة والنكهة الأصيلة ومنتجات مختارة بعناية لتناسب الطبخ اليومي.",

  storyTitle: "قصتنا",
  storyText:
    "من شغف بالنكهة إلى وعد بالجودة. وُلدت Goly Rozh لتقديم نكهة أصيلة لكل مطبخ، بمنتجات مختارة بعناية وجودة يمكن الوثوق بها كل يوم.",

  cardTitles: [
    "الجودة",
    "الهوية",
    "الخبرة",
  ],

  cardTexts: [
    "منتجات مختارة بعناية تجمع بين الجودة الموثوقة والطعم المميز.",
    "هوية متجذرة في الأصالة والثقة والتقاليد التي تمثل Goly Rozh.",
    "خبرة واهتمام بالتفاصيل لتقديم منتجات تناسب الطبخ اليومي.",
  ],
},
 ku: {
  eyebrow: "چیرۆکی ئێمە",
  titleTop: "گولی ڕۆژ",
  titleBottom: "دەربارەی",
  desc:
    "چیرۆک و بەها و کوالێتیی پشت بەرهەمەکانی گولی ڕۆژ بناسە.",
  body:
    "گولی ڕۆژ کوالێتیی متمانەپێکراو، تامی ڕەسەن و بەرهەمی بە وردی هەڵبژێردراو بۆ چێشتلێنانی ڕۆژانە پێکەوە دەهێنێت.",

  storyTitle: "چیرۆکی ئێمە",
  storyText:
    "لە خولیای تامەوە تا بەڵێنی کوالێتی، گولی ڕۆژ بۆ گەیاندنی تامی ڕەسەن بۆ هەر چێشتخانەیەک دروست بوو، بە بەرهەمی هەڵبژێردراو و کوالێتیی متمانەپێکراو.",

  cardTitles: [
    "کوالێتی",
    "ناسنامە",
    "ئەزموون",
  ],

  cardTexts: [
    "بەرهەمی بە وردی هەڵبژێردراو بە کوالێتیی متمانەپێکراو و تامی تایبەت.",
    "ناسنامەیەک کە لە ڕەسەنایەتی، متمانە و نەریتەکانی گولی ڕۆژ ڕەگ دەگرێت.",
    "ئەزموون و وردبینی بۆ پێشکەشکردنی بەرهەمێکی گونجاو بۆ چێشتلێنانی ڕۆژانە.",
  ],
},
};

function getImageUrl(image) {
  if (!image) return "";

  if (typeof image === "string") {
    return image;
  }

  if (typeof image?.url === "string") {
    return image.url;
  }

  if (typeof image?.asset?.url === "string") {
    return image.asset.url;
  }

  return "";
}

export default function GolyRozhAboutSection() {
  const { lang } = useLanguage();

  const currentLang = ["en", "ar", "ku"].includes(lang)
    ? lang
    : "en";

  const copy = COPY[currentLang];

  const isRTL =
    currentLang === "ar" ||
    currentLang === "ku";

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
      ? "ku-body"
      : "font-en-body";

  const [aboutData, setAboutData] =
    useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadAbout() {
      try {
        const response = await fetch(
          "/api/about",
          {
            cache: "no-store",
          },
        );

        const data =
          await response.json();

        if (!ignore && data?.item) {
          setAboutData(data.item);
        }
      } catch {
        /* keep fallback content */
      }
    }

    loadAbout();

    return () => {
      ignore = true;
    };
  }, []);

 const mainImage =
  getImageUrl(
    aboutData?.mainImage,
  );

const cards = [
  {
    number: "02",
    title: copy.cardTitles?.[0],
    text: copy.cardTexts?.[0],

   img: "/goly-rozh/about-pic-002.webp",
    imgSquare: "/goly-rozh/about-pic-002.webp",

  },

  {
    number: "03",
    title: copy.cardTitles?.[1],
    text: copy.cardTexts?.[1],

    img: "/goly-rozh/about-pic-001.webp",
    imgSquare: "/goly-rozh/about-pic-001.webp",
  },

  {
    number: "04",
    title: copy.cardTitles?.[2],
    text: copy.cardTexts?.[2],

   img: "/goly-rozh/about-pic-003.webp",
    imgSquare: "/goly-rozh/about-pic-003.webp",
  },
];
  return (
    <section
      id="about"
      className={styles.aboutSection}
      dir={isRTL ? "rtl" : "ltr"}
      data-lang={currentLang}
    >
      <div
        className={styles.lightHalo}
        aria-hidden="true"
      />

      <div className={styles.inner}>
        <GolyRozhReveal
          key={currentLang}
          className={
            styles.headingWrap
          }
          replayKey={currentLang}
        >
          <GolyRozhSectionHeading
            eyebrow={copy.eyebrow}
            titleTop={copy.titleTop}
            titleBottom={
              copy.titleBottom
            }
            desc={copy.desc}
            lang={currentLang}
            className={
              styles.heading
            }
          />
        </GolyRozhReveal>

       <div
  className={`${styles.themeCard} ${styles.heroCard}`}
>
  <div
    className={
      styles.heroImageWrap
    }
  >
    {mainImage ? (
      <img
        src={mainImage}
        alt=""
        className={
          styles.heroImage
        }
        draggable="false"
      />
    ) : null}
  </div>

  <div className={styles.storyPanel}>
    <span
      className={styles.storyNumber}
      aria-hidden="true"
    >
      01
    </span>

    <div className={styles.storyContent}>
      <div
  className={`${styles.storyTitle} ${titleFont}`}
>
  {copy.storyTitle}
</div>
     <p
  className={`${styles.storyText} ${bodyFont}`}
>
  {copy.storyText}
</p>
    </div>
  </div>
</div>

        {cards.length > 0 ? (
          <div
            className={
              styles.cardsGrid
            }
          >
            {cards.map(
              (card, index) => (
                <div
                  key={index}
                  className={
                    styles.themeCard
                  }
                >
                 <div
  className={
    styles.cardImageWrap
  }
>
  <picture>
    {card.imgSquare ? (
      <>
        <source
          media="(orientation: portrait) and (min-width: 768px) and (max-width: 1023px)"
          srcSet={card.imgSquare}
        />

        <source
          media="(orientation: landscape) and (max-width: 1023px)"
          srcSet={card.imgSquare}
        />

        <source
          media="(max-width: 420px)"
          srcSet={card.imgSquare}
        />
      </>
    ) : null}

    <img
      src={
        card.img ||
        card.imgSquare
      }
      alt=""
      className={
        styles.cardImage
      }
      draggable="false"
    />
  </picture>
</div>

<div className={styles.cardOverlay}>
  <span
    className={styles.cardNumber}
    aria-hidden="true"
  >
    {card.number}
  </span>

  <div className={styles.cardContent}>
   <div
  className={`${styles.cardStoryTitle} ${titleFont}`}
>
  {card.title}
</div>

    <p
  className={`${styles.cardStoryText} ${bodyFont}`}
>
  {card.text}
</p>
  </div>
</div>
                </div>
              ),
            )}
          </div>
        ) : null}

        <div
          className={`${styles.aboutText} ${bodyFont}`}
        >
          <p>{copy.body}</p>
        </div>
      </div>
    </section>
  );
}