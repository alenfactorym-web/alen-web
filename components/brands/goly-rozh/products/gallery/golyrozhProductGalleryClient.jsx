"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import OrganicProductShape from "@/components/brands/goly-rozh/OrganicProductShape";
import HeroCurve from "@/components/brands/goly-rozh/HeroCurve";
import GolyRozhSectionHeading from "@/components/brands/goly-rozh/shared/GolyRozhSectionHeading";
import GolyRozhProductNavRails from "@/components/brands/goly-rozh/products/shared/GolyRozhProductNavRails";

import styles from "./golyrozhProductGalleryClient.module.css";
import chipStyles from "../category/CategoryPageClient.module.css";function pickLang(obj, lang) {
  if (!obj) return "";

  if (lang === "ar") {
    return obj.ar || obj.en || "";
  }

  if (lang === "ku") {
    return obj.ku || obj.en || "";
  }

  return obj.en || "";
}


function prettySlug(slug = "") {
  return String(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}


function titleCase(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}


function getCartonText(item, lang) {
  const unitsPerPack =
    Number(item?.unitsPerPack || 0);

  const packsPerCarton =
    Number(item?.packsPerCarton || 0);


  if (
    unitsPerPack > 0 &&
    packsPerCarton > 0
  ) {
    if (lang === "ar") {
      return `${packsPerCarton} باكيت × ${unitsPerPack}`;
    }

    if (lang === "ku") {
      return `${packsPerCarton} پاکێت × ${unitsPerPack}`;
    }

    return `${packsPerCarton} packs × ${unitsPerPack}`;
  }


  return "-";
}

const infoOrbitVariants = {
  enter: (direction) => ({
    x: 70,

    rotate:
      direction > 0
        ? -16
        : 16,

    scale: 0.965,

    opacity: 0,

    filter:
      "blur(10px)",
  }),


  center: {
    x: 0,

    rotate: 0,

    scale: 1,

    opacity: 1,

    filter:
      "blur(0px)",
  },


  exit: (direction) => ({
    x: 70,

    rotate:
      direction > 0
        ? 16
        : -16,

    scale: 0.965,

    opacity: 0,

    filter:
      "blur(10px)",
  }),
};

export default function GolyRozhProductGalleryClient({
  brand = "goly-rozh",
  category,
  group,
  lang = "en",

  items = [],
  title = null,

  productGroups = [],
  allCategories = [],

  backHref,

  page = 1,
  perPage = 12,
  total = 0,
}) {
  const searchParams = useSearchParams();
const queryLang = searchParams.get("lang");

const safeLang = ["en", "ar", "ku"].includes(queryLang)
  ? queryLang
  : ["en", "ar", "ku"].includes(lang)
  ? lang
  : "en";

  const isRTL =
    safeLang === "ar" ||
    safeLang === "ku";

  const titleFont =
  safeLang === "ar"
    ? "font-ar-title"
    : safeLang === "ku"
    ? "ku-title"
    : "";

const bodyFont =
  safeLang === "ar"
    ? "font-ar-body"
    : safeLang === "ku"
    ? "ku-title"
    : "";

  const safeItems =
    Array.isArray(items)
      ? items
      : [];

  const safeCategories =
    Array.isArray(allCategories)
      ? allCategories
      : [];

  const safeGroups =
    Array.isArray(productGroups)
      ? productGroups
      : [];

  const currentPage =
    Math.max(1, Number(page || 1));

  const effectivePerPage =
    Math.max(1, Number(perPage || 12));

  const effectiveTotal =
    Math.max(
      0,
      Number(total) || safeItems.length
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        effectiveTotal /
          effectivePerPage
      )
    );

  const canPrev =
    currentPage > 1;

  const canNext =
    currentPage < totalPages;

const [activeIndex, setActiveIndex] =
  useState(null);


const [takeoverDirection, setTakeoverDirection] =
  useState(1);


const isTakeoverOpen =
  activeIndex !== null;

const activeItem =
  activeIndex === null
    ? null
    : safeItems[activeIndex];

const activeLabel =
  activeItem
    ? (
        pickLang(
          activeItem?.name,
          safeLang
        ) ||
        pickLang(
          activeItem?.title,
          safeLang
        ) ||
        activeItem?.label ||
        `Product ${activeIndex + 1}`
      )
    : "";


const activeSrc =
  activeItem?.image ||
  "/fallback.png";


const activeKey =
  activeItem
    ? (
        activeItem?.id ||
        activeItem?._id ||
        activeItem?.image ||
        `product-${activeIndex}`
      )
    : "";


const activeNumber =
  activeIndex === null
    ? 0
    : (
        (currentPage - 1) *
          effectivePerPage +
        activeIndex +
        1
      );


const openTakeover = (index) => {
  if (typeof window === "undefined") {
    return;
  }

  const isLargeMonitor = window.matchMedia(
  "(min-width: 1280px) and (min-height: 900px) and (orientation: landscape)"
).matches;

const isLaptop = window.matchMedia(
  "(min-width: 1024px) and (max-height: 899px) and (orientation: landscape)"
).matches;

const isTabletLandscape = window.matchMedia(
  "(min-width: 768px) and (max-width: 1366px) and (orientation: landscape) and (hover: none) and (pointer: coarse)"
).matches;

const isTabletPortrait = window.matchMedia(
  "(min-width: 601px) and (max-width: 1180px) and (min-height: 900px) and (orientation: portrait)"
).matches;

const isMobileLandscape = window.matchMedia(
  "(max-width: 932px) and (max-height: 550px) and (orientation: landscape)"
).matches;

const isMobilePortrait = window.matchMedia(
  "(max-width: 600px) and (min-height: 551px) and (orientation: portrait)"
).matches;

if (
  !isLargeMonitor &&
  !isLaptop &&
  !isTabletLandscape &&
  !isTabletPortrait &&
  !isMobileLandscape &&
  !isMobilePortrait
) {
  return;
} 
 setActiveIndex(index);
};


const closeTakeover = () => {
  setActiveIndex(null);
};


const moveTakeover = (direction) => {  setTakeoverDirection(direction);

  setActiveIndex((current) => {
    if (current === null) {
      return current;
    }

    return (
      current +
      direction +
      safeItems.length
    ) % safeItems.length;
  });
};

useEffect(() => {
  if (!isTakeoverOpen) {
    return;
  }


  const body =
    document.body;

  const html =
    document.documentElement;


  const lockedScrollX =
    window.scrollX;

  const lockedScrollY =
    window.scrollY;


  const previousBodyOverflow =
    body.style.overflow;

  const previousHtmlOverflow =
    html.style.overflow;

  const previousPaddingRight =
    body.style.paddingRight;

  const previousOverscrollBehavior =
    html.style.overscrollBehavior;


  const scrollbarWidth =
    window.innerWidth -
    document.documentElement.clientWidth;


  const currentPaddingRight =
    parseFloat(
      window
        .getComputedStyle(body)
        .paddingRight
    ) || 0;


  if (scrollbarWidth > 0) {
    body.style.paddingRight =
      `${
        currentPaddingRight +
        scrollbarWidth
      }px`;
  }


  body.style.overflow =
    "hidden";

  html.style.overflow =
    "hidden";

  html.style.overscrollBehavior =
    "none";


  let wheelLocked =
    false;

  let wheelUnlockTimer =
    null;


  const holdScrollPosition = () => {
    if (
      window.scrollX !==
        lockedScrollX ||
      window.scrollY !==
        lockedScrollY
    ) {
      window.scrollTo(
        lockedScrollX,
        lockedScrollY
      );
    }
  };


  const onWheel = (event) => {
    event.preventDefault();
    event.stopPropagation();


    if (
      Math.abs(event.deltaY) <
      10
    ) {
      return;
    }


    if (wheelLocked) {
      return;
    }


    wheelLocked =
      true;


    const direction =
  event.deltaY > 0
    ? 1
    : -1;


setTakeoverDirection(
  direction
);


setActiveIndex((current) => {
  if (current === null) {
    return current;
  }

  return (
    current +
    direction +
    safeItems.length
  ) % safeItems.length;
});


    wheelUnlockTimer =
  window.setTimeout(
    () => {
      wheelLocked =
        false;
    },
    370
  );
  };


  const onTouchMove = (event) => {
    event.preventDefault();
  };


  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      setActiveIndex(null);
    }


    if (
      event.key ===
      "ArrowLeft"
    ) {
setTakeoverDirection(-1);
      setActiveIndex(
        (current) =>
          current === null
            ? current
            : (
                current -
                1 +
                safeItems.length
              ) %
              safeItems.length
      );
    }


    if (
      event.key ===
      "ArrowRight"
    ) {
  setTakeoverDirection(1);

      setActiveIndex(
        (current) =>
          current === null
            ? current
            : (
                current +
                1
              ) %
              safeItems.length
      );
    }
  };


  document.addEventListener(
    "wheel",
    onWheel,
    {
      passive: false,
      capture: true,
    }
  );


  document.addEventListener(
    "touchmove",
    onTouchMove,
    {
      passive: false,
      capture: true,
    }
  );


  window.addEventListener(
    "scroll",
    holdScrollPosition,
    {
      passive: true,
    }
  );


  window.addEventListener(
    "keydown",
    onKeyDown
  );


  return () => {
    if (
      wheelUnlockTimer !==
      null
    ) {
      window.clearTimeout(
        wheelUnlockTimer
      );
    }


    document.removeEventListener(
      "wheel",
      onWheel,
      true
    );


    document.removeEventListener(
      "touchmove",
      onTouchMove,
      true
    );


    window.removeEventListener(
      "scroll",
      holdScrollPosition
    );


    window.removeEventListener(
      "keydown",
      onKeyDown
    );


    body.style.overflow =
      previousBodyOverflow;

    html.style.overflow =
      previousHtmlOverflow;

    body.style.paddingRight =
      previousPaddingRight;

    html.style.overscrollBehavior =
      previousOverscrollBehavior;


    window.scrollTo(
      lockedScrollX,
      lockedScrollY
    );
  };
}, [
  isTakeoverOpen,
  safeItems.length,
]);  /* ========================================================= */

const activeCategory =
  safeCategories.find(
    (item) =>
      String(item?.slug || "").toLowerCase() ===
      String(category || "").toLowerCase()
  ) || null;


const activeGroup =
  safeGroups.find(
    (item) =>
      String(item?.slug || "").toLowerCase() ===
      String(group || "").toLowerCase()
  ) || null;


const activePackagingLabel =
  group === "direct"
    ? "-"
    : (
        pickLang(
          activeGroup?.title,
          safeLang
        ) ||
        prettySlug(group)
      );


const heroRawTitle =  pickLang(
    activeCategory?.title,
    safeLang
  ) ||
  prettySlug(category);


const heroTitle =
  safeLang === "en"
    ? titleCase(heroRawTitle).toUpperCase()
    : heroRawTitle;


const heroIsLong =
  safeLang === "en"
    ? heroTitle.length > 11
    : heroTitle.length > 8;

  const pageHref = (targetPage) =>
    `/brand/${brand}/products/${category}/${group}?lang=${safeLang}&page=${targetPage}`;


  const finalBackHref =
    backHref ||
    `/brand/${brand}/products/${category}?lang=${safeLang}`;


 return (
 <main
  className={`mini-site-goly-rozh ${chipStyles.page} ${styles.page} ${bodyFont}`}
  dir={isRTL ? "rtl" : "ltr"}
  data-lang={safeLang}
>
   <section
  className={`
    ${chipStyles.heroSection}
    ${chipStyles.fixedHeroSection}
    ${chipStyles.panelHeroSection}
    ${styles.galleryHero}
  `}
>
  <div className={chipStyles.shell}>

    <header className={chipStyles.header}>
      <GolyRozhSectionHeading
        key={`${category}-${safeLang}`}
        className={`${chipStyles.categoryHeading} ${
          heroIsLong
            ? chipStyles.categoryHeadingLong
            : ""
        } ${titleFont}`}
        eyebrow={
          safeLang === "ar"
            ? "الفئة"
            : safeLang === "ku"
              ? "پۆل"
              : "CATEGORY"
        }
        titleTop={heroTitle}
        titleBottom=""
        desc=""
        lang={safeLang}
      />
    </header>


    <GolyRozhProductNavRails
      brand={brand}
      categories={safeCategories}
      groups={
        group === "direct"
          ? []
          : safeGroups
      }
      activeCategorySlug={category}
      activeGroupSlug={
        group === "direct"
          ? ""
          : group
      }
      safeLang={safeLang}
    />

  </div>

  <HeroCurve />
</section>

    <section className={styles.productSection}>
      <div className={styles.shell}>

      


        {/* =====================================================
            GALLERY
        ===================================================== */}

        {safeItems.length > 0 ? (
          <div
            className={styles.grid}
            dir="ltr"
            data-count={safeItems.length}
          >
            {safeItems.map(
              (item, index) => {
                const label =
                  pickLang(
                    item?.name,
                    safeLang
                  ) ||
                  pickLang(
                    item?.title,
                    safeLang
                  ) ||
                  item?.label ||
                  `Product ${index + 1}`;

                const src =
  item?.image ||
  "/fallback.png";


const itemKey =
  item?.id ||
  item?._id ||
  item?.image ||
  `product-${index}`;


return (
  <motion.article
    key={itemKey}

    onClick={() =>
      openTakeover(index)
    }

    onKeyDown={(event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();

        openTakeover(index);
      }
    }}

    role="button"
    tabIndex={0}

    aria-label={
      `Open ${label}`
    }
                    className={styles.card}
dir="ltr"
                    initial={{
                      opacity: 0,
                      y: 24,
                      filter:
                        "blur(10px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter:
                        "blur(0px)",
                    }}
                    transition={{
                      duration: 0.72,
                      delay:
                        index * 0.045,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                  >
                    <div
                      className={
                        styles.visual
                      }
                    >
                      <OrganicProductShape
  index={index}
  seed={`${category}-${group}`}
  className={
    styles.shapeArt
  }
/>

<div className={styles.imageWrap}>
  <motion.div
    layoutId={`goly-product-${itemKey}`}
    className={styles.sharedImageMotion}
    transition={{
      type: "spring",
      stiffness: 135,
      damping: 24,
      mass: 0.9,
    }}
  >
    <Image
      src={src}
      alt={label}
      fill
      sizes="(min-width: 1280px) 25vw, 50vw"
      className={styles.image}
      draggable={false}
      priority={index < 4}
    />
  </motion.div>
</div>

</div>

                    <div
                      className={
                        styles.cardContent
                      }
                    >
                     <h3
  className={titleFont}
  dir={isRTL ? "rtl" : "ltr"}
>
  {label}
</h3>
                    </div>
                  </motion.article>
                );
              }
            )}
          </div>
        ) : (
          <div className={styles.empty}>
            {safeLang === "ar"
              ? "لا توجد منتجات حالياً"
              : safeLang === "ku"
              ? "هیچ بەرهەمێک نییە"
              : "No products available"}
          </div>
        )}


        {/* =====================================================
            PAGINATION
        ===================================================== */}

        <div
          className={styles.navigation}
          dir="ltr"
        >
          <div
            className={
              styles.navigationSide
            }
          >
            <Link
              href={finalBackHref}
              className={
                styles.navButton
              }
            >
              <span
                aria-hidden="true"
              >
                {isRTL
                  ? "→"
                  : "←"}
              </span>

              <span>
                {safeLang === "ar"
                  ? "رجوع"
                  : safeLang ===
                    "ku"
                  ? "گەڕانەوە"
                  : "Back"}
              </span>
            </Link>
          </div>


          <div
            className={
              styles.pagination
            }
          >
            <Link
              href={pageHref(
                Math.max(
                  1,
                  currentPage - 1
                )
              )}
              scroll={false}
              aria-disabled={
                !canPrev
              }
              className={`${styles.navButton} ${
                !canPrev
                  ? styles.disabled
                  : ""
              }`}
            >
              {safeLang === "ar"
                ? "السابق"
                : safeLang === "ku"
                ? "پێشوو"
                : "Prev"}
            </Link>

            <span
              className={
                styles.pageNumber
              }
            >
              {currentPage}
              <span>/</span>
              {totalPages}
            </span>

            <Link
              href={pageHref(
                Math.min(
                  totalPages,
                  currentPage + 1
                )
              )}
              scroll={false}
              aria-disabled={
                !canNext
              }
              className={`${styles.navButton} ${
                !canNext
                  ? styles.disabled
                  : ""
              }`}
            >
              {safeLang === "ar"
                ? "التالي"
                : safeLang === "ku"
                ? "داهاتوو"
                : "Next"}
            </Link>
          </div>


          <div
            className={
              styles.navigationSide
            }
          />
        </div>

       </div>
       </section>


    <AnimatePresence>
      {activeItem && (
        <motion.div
          className={
            styles.takeoverBackdrop
          }
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
         transition={{
  duration: 0.24,
}}
          onClick={
            closeTakeover
          }
        >
          <motion.section
            className={
              styles.takeoverStage
            }
            initial={{
  opacity: 0,
  y: 12,
  scale: 0.995,
}}
animate={{
  opacity: 1,
  y: 0,
  scale: 1,
}}
exit={{
  opacity: 0,
  y: 6,
  scale: 0.998,
}}
transition={{
  duration: 0.34,
  ease: [
    0.22,
    1,
    0.36,
    1,
  ],
}}
            onClick={(event) =>
              event.stopPropagation()
            }
            dir={
              isRTL
                ? "rtl"
                : "ltr"
            }
          >

            <button
  type="button"
  className={
    styles.takeoverClose
  }
  onClick={
    closeTakeover
  }
  aria-label="Close product"
>
  ×
</button>


<div
  className={
    styles.takeoverVisual
  }
  dir="ltr"
>

<motion.div
  key={`shape-${activeKey}`}
  className={styles.takeoverShape}
  initial={{
    scale: 0.94,
    rotate: -2,
  }}
  animate={{
    scale: 1,
    rotate: 0,
  }}
  exit={{
    scale: 0.97,
    rotate: 1,
  }}
  transition={{
    duration: 0.32,
    ease: [
      0.22,
      1,
      0.36,
      1,
    ],
  }}
>
  <OrganicProductShape
    index={activeIndex}
    seed={`${category}-${group}`}
    className={styles.takeoverShapeSvg}
  />
</motion.div>


<div className={styles.takeoverImagePosition}>
  <motion.div
    layoutId={`goly-product-${activeKey}`}
    className={styles.takeoverImageMotion}
    transition={{
      type: "spring",
      stiffness: 135,
      damping: 24,
      mass: 0.9,
    }}
  >
    <Image
      src={activeSrc}
      alt={activeLabel}
      fill
      sizes="50vw"
      className={styles.takeoverImage}
      draggable={false}
      priority
    />
  </motion.div>
</div>
           
</div>

<motion.div
  className={
    styles.takeoverInfo
  }
  initial={{
    opacity: 0,
    x: isRTL
      ? -40
      : 40,
  }}
  animate={{
    opacity: 1,
    x: 0,
  }}
  exit={{
    opacity: 0,
    x: isRTL
      ? -24
      : 24,
  }}
  transition={{
    duration: 0.52,
    delay: 0.12,
    ease: [
      0.22,
      1,
      0.36,
      1,
    ],
  }}
>


<div
  className={
    styles.takeoverInfoOrbitViewport
  }
>
    <AnimatePresence
  initial={false}
  mode="sync"
  custom={takeoverDirection}
>
  <motion.div
    key={activeKey}

    className={
      styles.takeoverInfoOrbit
    }

    custom={takeoverDirection}

    variants={
      infoOrbitVariants
    }

    initial="enter"

    animate="center"

    exit="exit"

    transition={{
  duration: 0.34,

  ease: [
    0.22,
    1,
    0.36,
    1,
  ],

  opacity: {
    duration: 0.26,
  },

  filter: {
    duration: 0.26,
  },
}}
  >

        <div
          className={
            styles.takeoverInfoTop
          }
        >
          <span
            className={
              styles.takeoverBrand
            }
          >
            GOLY ROZH
          </span>
        </div>


       <h2 className={titleFont}>
  {safeLang === "en" &&
  activeLabel.toUpperCase().startsWith("GRINDED ")
    ? (
      <>
        <span style={{ display: "block" }}>
          GRINDED
        </span>
        <span style={{ display: "block", whiteSpace: "nowrap" }}>
          {activeLabel.slice(8)}
        </span>
      </>
    )
    : activeLabel}
</h2>


        <div
          className={
            styles.takeoverSpecs
          }
        >

          <div
            className={
              styles.takeoverSpecItem
            }
          >
            <span>
              {safeLang === "ar"
                ? "نوع التعبئة"
                : safeLang === "ku"
                ? "جۆری پاکەت"
                : "PACKAGING"}
            </span>

            <strong>
              {activePackagingLabel}
            </strong>
          </div>


          <div
            className={
              styles.takeoverSpecItem
            }
          >
            <span>
              {safeLang === "ar"
                ? "الكمية / كرتون"
                : safeLang === "ku"
                ? "ژمارە / کارتۆن"
                : "QTY / CARTON"}
            </span>

            <strong>
              {getCartonText(
                activeItem,
                safeLang
              )}
            </strong>
          </div>


          <div
            className={
              styles.takeoverSpecItem
            }
          >
            <span>
              {safeLang === "ar"
                ? "عدد الوحدات"
                : safeLang === "ku"
                ? "ژمارەی دانە"
                : "UNITS / PACK"}
            </span>

            <strong>
              {activeItem?.unitsPerPack || "-"}
            </strong>
          </div>


          <div
            className={
              styles.takeoverSpecItem
            }
          >
            <span>
              {safeLang === "ar"
                ? "باكيت / كرتون"
                : safeLang === "ku"
                ? "پاکێت / کارتۆن"
                : "PACKS / CARTON"}
            </span>

            <strong>
              {activeItem?.packsPerCarton || "-"}
            </strong>
                   </div>

        </div>


      </motion.div>
    </AnimatePresence>
  </div>

</motion.div>


<div
  className={
    styles.takeoverNavigation
  }
  dir="ltr"
>

  <button
    type="button"
    className={
      styles.takeoverArrowPrev
    }
    onClick={() =>
      moveTakeover(-1)
    }
    aria-label="Previous product"
  >
    <span aria-hidden="true">
      ‹
    </span>
  </button>


  <div
    className={
      styles.takeoverProgress
    }
    aria-hidden="true"
  >
    <motion.span
      className={
        styles.takeoverProgressFill
      }
      initial={false}
      animate={{
        width: `${
          Math.min(
            100,
            (
              activeNumber /
              Math.max(
                effectiveTotal,
                1
              )
            ) * 100
          )
        }%`,
      }}
      transition={{
        duration: 0.34,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
    />
  </div>


  <button
    type="button"
    className={
      styles.takeoverArrowNext
    }
    onClick={() =>
      moveTakeover(1)
    }
    aria-label="Next product"
  >
    <span aria-hidden="true">
        ›

    </span>
  </button>

</div>


</motion.section>
        </motion.div>
      )}
    </AnimatePresence>


  </main>
);
}