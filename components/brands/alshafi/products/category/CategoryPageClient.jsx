"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./CategoryPageClient.module.css";
import AlshafiSectionHeading from "@/components/brands/alshafi/shared/AlshafiSectionHeading";

function pickLang(obj, lang) {
  if (!obj) return "";
  if (lang === "ar") return obj.ar || obj.en || "";
  if (lang === "ku") return obj.ku || obj.en || "";
  return obj.en || "";
}

function prettySlug(slug = "") {
  return String(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function titleCase(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CategoryPageClient({
  brand,
  category,
  lang,
  initialProductGroups = [],
  initialPackaging = [],
  allCategories = [],
}) {
  const router = useRouter();

  const safeLang = ["en", "ar", "ku"].includes(lang) ? lang : "en";
  const isRTL = safeLang === "ar" || safeLang === "ku";

  const titleFont =
    safeLang === "ar" ? "font-ar-title" : safeLang === "ku" ? "ku-title" : "";

  const bodyFont =
    safeLang === "ar" ? "font-ar-body" : safeLang === "ku" ? "ku-title" : "";

  const hasProductGroups =
    Array.isArray(initialProductGroups) && initialProductGroups.length > 0;

  const items = hasProductGroups
    ? initialProductGroups
    : Array.isArray(initialPackaging)
    ? initialPackaging
    : [];

  const activeCategory =
    allCategories.find((cat) => cat.slug === category) || null;

  const rawCategoryTitle =
    pickLang(activeCategory?.title, safeLang) || prettySlug(category);

  const categoryTitle =
    safeLang === "en"
      ? titleCase(rawCategoryTitle).toUpperCase()
      : rawCategoryTitle;

  const isLongCategoryTitle =
    safeLang === "en" ? categoryTitle.length > 11 : categoryTitle.length > 8;

  const splitTitle = {
    top: categoryTitle,
    bottom: "",
  };

  const sectionLabel = hasProductGroups
    ? safeLang === "ar"
      ? "اختر مجموعة المنتجات"
      : safeLang === "ku"
      ? "گرووپی بەرهەم هەڵبژێرە"
      : "Choose Product Group"
    : safeLang === "ar"
    ? "اختر النوع"
    : safeLang === "ku"
    ? "جۆر هەڵبژێرە"
    : "Choose Type";

  const categoryIntro =
    safeLang === "ar"
      ? "استكشف مجموعات منتجاتنا المميزة لكل وصفة."
      : safeLang === "ku"
      ? "گرووپە تایبەتەکانی بەرهەمەکانمان بۆ هەموو خواردنێک بناسە."
      : "Explore Alshafi product groups crafted for premium taste and everyday use.";

  const categoryBarRef = useRef(null);
  const categoryTabRefs = useRef([]);

  const groupBarRef = useRef(null);
  const groupTabRefs = useRef([]);

  const activeCategoryIndex = Math.max(
    0,
    allCategories.findIndex((cat) => cat.slug === category)
  );

  const activeGroupIndex = 0;

  const [categoryGlass, setCategoryGlass] = useState({
    left: 0,
    width: 0,
    ready: false,
  });

  const [groupGlass, setGroupGlass] = useState({
    left: 0,
    width: 0,
    ready: false,
  });

  const dragRef = useRef({
    type: null,
    pointerId: null,
    startX: 0,
    startLeft: 0,
    width: 0,
    moved: false,
  });

  function moveCategoryGlass(index) {
    const tab = categoryTabRefs.current[index];
    const bar = categoryBarRef.current;

    if (!tab || !bar) return;

    setCategoryGlass({
      left: tab.offsetLeft,
      width: tab.offsetWidth,
      ready: true,
    });
  }

  function moveGroupGlass(index) {
    const tab = groupTabRefs.current[index];
    const bar = groupBarRef.current;

    if (!tab || !bar) return;

    setGroupGlass({
      left: tab.offsetLeft,
      width: tab.offsetWidth,
      ready: true,
    });
  }

 function getDragData(type) {
  if (type === "category") {
    return {
      bar: categoryBarRef.current,
      tabs: categoryTabRefs.current,
      glass: categoryGlass,
      setGlass: setCategoryGlass,
     getHref: (index) => {
  const cat = allCategories[index];
  const slug = cat?.slug;

  if (!slug) return "";

  const isDirectCategory =
    !cat.hasProductGroups &&
    !cat.hasPackaging &&
    cat.hasDirectProducts;

  return isDirectCategory
    ? `/brand/${brand}/products/${slug}/direct?lang=${safeLang}&page=1`
    : `/brand/${brand}/products/${slug}?lang=${safeLang}`;
},
    };
  }

  return {
    bar: groupBarRef.current,
    tabs: groupTabRefs.current,
    glass: groupGlass,
    setGlass: setGroupGlass,
    getHref: (index) => {
      const slug = items[index]?.slug;
      return slug
        ? `/brand/${brand}/products/${category}/${slug}?lang=${safeLang}&page=1`
        : "";
    },
  };
}

function scrollChipIntoView(tab, bar) {
  if (!tab || !bar) return;

  const edgeGap = 12;

  const tabLeft = tab.offsetLeft;
  const tabRight = tab.offsetLeft + tab.offsetWidth;

  const visibleLeft = bar.scrollLeft;
  const visibleRight = bar.scrollLeft + bar.clientWidth;

  let nextScrollLeft = bar.scrollLeft;

  if (tabLeft < visibleLeft + edgeGap) {
    nextScrollLeft = tabLeft - edgeGap;
  } else if (tabRight > visibleRight - edgeGap) {
    nextScrollLeft = tabRight - bar.clientWidth + edgeGap;
  }

  const maxScroll = Math.max(0, bar.scrollWidth - bar.clientWidth);
  nextScrollLeft = Math.max(0, Math.min(maxScroll, nextScrollLeft));

  if (Math.abs(nextScrollLeft - bar.scrollLeft) > 1) {
    bar.scrollTo({
      left: nextScrollLeft,
      behavior: "auto",
    });
  }
}

function scrollActiveChipsIntoView() {
  requestAnimationFrame(() => {
    scrollChipIntoView(
      categoryTabRefs.current[activeCategoryIndex],
      categoryBarRef.current
    );

    scrollChipIntoView(
      groupTabRefs.current[activeGroupIndex],
      groupBarRef.current
    );
  });
}

  function startGlassDrag(type, event) {
    const data = getDragData(type);
    const { bar, glass } = data;

    if (!bar || !glass.ready || glass.width <= 0) return;

    const barRect = bar.getBoundingClientRect();
    const pointerX = event.clientX - barRect.left + bar.scrollLeft;

    const insideGlass =
      pointerX >= glass.left && pointerX <= glass.left + glass.width;

    if (!insideGlass) return;

    event.preventDefault();

    dragRef.current = {
      type,
      pointerId: event.pointerId,
      startX: pointerX,
      startLeft: glass.left,
      width: glass.width,
      moved: false,
    };

    bar.setPointerCapture?.(event.pointerId);
  }

  function moveGlassDrag(type, event) {
    const drag = dragRef.current;

    if (drag.type !== type || drag.pointerId !== event.pointerId) return;

    const data = getDragData(type);
    const { bar, setGlass } = data;

    if (!bar) return;

    event.preventDefault();

    const barRect = bar.getBoundingClientRect();
    const pointerX = event.clientX - barRect.left + bar.scrollLeft;
    const deltaX = pointerX - drag.startX;

    if (Math.abs(deltaX) > 4) {
      dragRef.current.moved = true;
    }

    const maxLeft = Math.max(0, bar.scrollWidth - drag.width);
    const nextLeft = Math.max(0, Math.min(maxLeft, drag.startLeft + deltaX));

    setGlass({
      left: nextLeft,
      width: drag.width,
      ready: true,
    });

    const visibleLeft = bar.scrollLeft;
    const visibleRight = bar.scrollLeft + bar.clientWidth;
    const glassLeft = nextLeft;
    const glassRight = nextLeft + drag.width;

    if (glassLeft < visibleLeft + 24) {
      bar.scrollLeft = Math.max(0, glassLeft - 24);
    }

    if (glassRight > visibleRight - 24) {
      bar.scrollLeft = glassRight - bar.clientWidth + 24;
    }
  }

  function endGlassDrag(type, event) {
    const drag = dragRef.current;

    if (drag.type !== type || drag.pointerId !== event.pointerId) return;

    const data = getDragData(type);
    const { bar, tabs, glass, setGlass, getHref } = data;

    dragRef.current = {
      type: null,
      pointerId: null,
      startX: 0,
      startLeft: 0,
      width: 0,
      moved: false,
    };

    if (!bar || !Array.isArray(tabs) || tabs.length === 0) return;

    const glassCenter = glass.left + glass.width / 2;

    let nearestIndex = 0;
    let nearestDistance = Infinity;

    tabs.forEach((tab, index) => {
      if (!tab) return;

      const tabCenter = tab.offsetLeft + tab.offsetWidth / 2;
      const distance = Math.abs(tabCenter - glassCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    const nearestTab = tabs[nearestIndex];

    if (!nearestTab) return;

    setGlass({
      left: nearestTab.offsetLeft,
      width: nearestTab.offsetWidth,
      ready: true,
    });

    const href = getHref(nearestIndex);

    if (href) {
      router.push(href);
    }
  }

  useLayoutEffect(() => {
    let frameOne;
    let frameTwo;
    let cancelled = false;

   function refreshGlass() {
  if (cancelled) return;

  moveCategoryGlass(activeCategoryIndex);
  moveGroupGlass(activeGroupIndex);
  scrollActiveChipsIntoView();
}

    frameOne = requestAnimationFrame(() => {
      refreshGlass();

      frameTwo = requestAnimationFrame(() => {
        refreshGlass();
      });
    });

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        refreshGlass();
      });
    }

    function handleResize() {
      refreshGlass();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameOne);
      cancelAnimationFrame(frameTwo);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    safeLang,
    category,
    activeCategoryIndex,
    activeGroupIndex,
    allCategories.length,
    items.length,
  ]);

  const showProductGroupNav = true;

  return (
   <main
  className={`mini-site-alshafi ${styles.page} ${bodyFont}`}
  dir="ltr"
  data-lang={safeLang}
>
      <section className={styles.section}>
        <div className={styles.shell}>
          <header className={styles.header}>
            <AlshafiSectionHeading
              className={`${styles.categoryHeading} ${
                isLongCategoryTitle ? styles.categoryHeadingLong : ""
              } ${titleFont}`}
              eyebrow={
                safeLang === "ar"
                  ? "الفئة"
                  : safeLang === "ku"
                  ? "پۆل"
                  : "CATEGORY"
              }
              titleTop={splitTitle.top}
              bottomTitle={splitTitle.bottom}
              desc=""
              featureOne=""
              featureOneDesc=""
              featureTwo=""
              featureTwoDesc=""
              imageSrc=""
              animateLetters={safeLang === "en"}
              lang={safeLang}
            />
          </header>
<div className={styles.titleBackWrap}>
  <Link
    href={`/brand/${brand}?lang=${safeLang}#products`}
    className={styles.titleBackLink}
  >
    {safeLang === "ar"
  ? "المنتجات ›"
  : safeLang === "ku"
  ? "بەرهەمەکان ›"
  : "‹ Products"}
  </Link>
</div>
          {Array.isArray(allCategories) && allCategories.length > 0 ? (
            <nav
              ref={categoryBarRef}
              className={styles.categoryBar}
              aria-label="Categories"
              onMouseLeave={() => {
                if (!dragRef.current.type) {
                  moveCategoryGlass(activeCategoryIndex);
                }
              }}
              onPointerDown={(event) => startGlassDrag("category", event)}
              onPointerMove={(event) => moveGlassDrag("category", event)}
              onPointerUp={(event) => endGlassDrag("category", event)}
              onPointerCancel={(event) => endGlassDrag("category", event)}
            >
              <span
                className={styles.categoryGlass}
                style={{
                  width: `${categoryGlass.width}px`,
                  transform: `translateX(${categoryGlass.left}px)`,
                  opacity: categoryGlass.ready ? 1 : 0,
                }}
              />

              {allCategories.map((cat, index) => {
  const slug = cat.slug;
  const rawLabel = pickLang(cat.title, safeLang) || prettySlug(slug);
  const label = safeLang === "en" ? titleCase(rawLabel) : rawLabel;
  const active = slug === category;

  const isDirectCategory =
    !cat.hasProductGroups &&
    !cat.hasPackaging &&
    cat.hasDirectProducts;

  const categoryHref = isDirectCategory
    ? `/brand/${brand}/products/${slug}/direct?lang=${safeLang}&page=1`
    : `/brand/${brand}/products/${slug}?lang=${safeLang}`;

  return (
    <Link
      key={slug}
      ref={(el) => {
        categoryTabRefs.current[index] = el;
      }}
      href={categoryHref}
                    onMouseEnter={() => {
                      if (!dragRef.current.type) {
                        moveCategoryGlass(index);
                      }
                    }}
                    className={`${styles.categoryTab} ${
                      active ? styles.categoryTabActive : ""
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          ) : null}

          <p className={styles.categoryIntro}>{categoryIntro}</p>

          {items.length > 0 ? (
            <>
              {showProductGroupNav ? (
               <nav
  ref={groupBarRef}
  data-count={items.length}
  className={`${styles.groupBar} ${
    items.length <= 2 ? styles.groupBarCompact : styles.groupBarScrollable
  }`}
  aria-label={sectionLabel}
                  onMouseLeave={() => {
                    if (!dragRef.current.type) {
                      moveGroupGlass(activeGroupIndex);
                    }
                  }}
                  onPointerDown={(event) => startGlassDrag("group", event)}
                  onPointerMove={(event) => moveGlassDrag("group", event)}
                  onPointerUp={(event) => endGlassDrag("group", event)}
                  onPointerCancel={(event) => endGlassDrag("group", event)}
                >
                  <span
                    className={styles.groupGlass}
                    style={{
                      width: `${groupGlass.width}px`,
                      transform: `translateX(${groupGlass.left}px)`,
                      opacity: groupGlass.ready ? 1 : 0,
                    }}
                  />

                  {items.map((item, index) => {
                    const rawLabel =
                      pickLang(item.title, safeLang) || prettySlug(item.slug);
                    const label =
                      safeLang === "en" ? titleCase(rawLabel) : rawLabel;

                    return (
                      <Link
                        key={item._id || item.slug}
                        ref={(el) => {
                          groupTabRefs.current[index] = el;
                        }}
                        href={`/brand/${brand}/products/${category}/${item.slug}?lang=${safeLang}&page=1`}
                        onMouseEnter={() => {
                          if (!dragRef.current.type) {
                            moveGroupGlass(index);
                          }
                        }}
                        className={`${styles.groupTab} ${
                          index === 0 ? styles.groupTabActive : ""
                        }`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </nav>
              ) : null}

              <div className={styles.grid}>
                {items.map((item, index) => {
                  const rawLabel =
                    pickLang(item.title, safeLang) || prettySlug(item.slug);
                  const label =
                    safeLang === "en" ? titleCase(rawLabel) : rawLabel;

                  return (
                    <Link
                      key={item._id || item.slug}
                      href={`/brand/${brand}/products/${category}/${item.slug}?lang=${safeLang}&page=1`}
                      className={`${styles.card} ${
                        index === 0 ? styles.cardLarge : ""
                      }`}
                    >
                      <div className={styles.imageWrap}>
                        <Image
                          src={item.image || "/fallback.png"}
                          alt={label}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className={styles.image}
                          draggable={false}
                        />
                      </div>

                      <div className={styles.cardContent} dir={isRTL ? "rtl" : "ltr"}>
                        <h3>{label}</h3>

                        <span>
                          {safeLang === "ar"
                            ? "عرض المنتجات"
                            : safeLang === "ku"
                            ? "بینینی بەرهەمەکان"
                            : "View Products"}{" "}
                          →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              {safeLang === "ar"
                ? "لا توجد عناصر حالياً"
                : safeLang === "ku"
                ? "هیچ بابەتێک نییە"
                : "No items available"}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}