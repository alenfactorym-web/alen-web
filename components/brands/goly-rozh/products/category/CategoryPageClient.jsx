"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, } from "next/navigation";
import Link from "next/link";
import styles from "./CategoryPageClient.module.css";
import ProductGroupRail from "./ProductGroupRail";
import GolyRozhSectionHeading from "@/components/brands/goly-rozh/shared/GolyRozhSectionHeading";
import HeroCurve from "@/components/brands/goly-rozh/HeroCurve";
import GolyRozhProductNavRails from "@/components/brands/goly-rozh/products/shared/GolyRozhProductNavRails";
function pickLang(obj, lang) {
    if (!obj)
        return "";
    if (lang === "ar")
        return obj.ar || obj.en || "";
    if (lang === "ku")
        return obj.ku || obj.en || "";
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
export default function CategoryPageClient({ brand, category, lang, initialProductGroups = [], initialPackaging = [], allCategories = [], }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryLang = searchParams.get("lang");
    const safeLang = ["en", "ar", "ku"].includes(queryLang)
        ? queryLang
        : ["en", "ar", "ku"].includes(lang)
            ? lang
            : "en";
    const isRTL = safeLang === "ar" || safeLang === "ku";
    const titleFont = safeLang === "ar" ? "font-ar-title" : safeLang === "ku" ? "ku-title" : "";
    const bodyFont = safeLang === "ar" ? "font-ar-body" : safeLang === "ku" ? "ku-title" : "";
    const hasProductGroups = Array.isArray(initialProductGroups) && initialProductGroups.length > 0;
    const items = hasProductGroups
        ? initialProductGroups
        : Array.isArray(initialPackaging)
            ? initialPackaging
            : [];
    const activeCategory = allCategories.find((cat) => cat.slug === category) || null;
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
  const categoryBarRef = useRef(null);
const categoryTabRefs = useRef([]);

const groupBarRef = useRef(null);
const groupTabRefs = useRef([]);

const productSectionRef = useRef(null);
const productRailRefs = useRef(new Map());

const activeCategoryIndex = Math.max(
  0,
  allCategories.findIndex(
    (cat) => cat.slug === category
  )
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
    const [categoryRailData, setCategoryRailData,] = useState(() => {
        if (Array.isArray(allCategories) &&
            allCategories.length > 0) {
            return allCategories.map((cat) => ({
                ...cat,
                productGroups: cat.slug === category &&
                    hasProductGroups
                    ? initialProductGroups
                    : [],
                packaging: cat.slug === category &&
                    !hasProductGroups
                    ? initialPackaging
                    : [],
                directProductsCount: 0,
            }));
        }
        return [
            {
                slug: category,
                title: activeCategory?.title,
                productGroups: hasProductGroups
                    ? initialProductGroups
                    : [],
                packaging: !hasProductGroups
                    ? initialPackaging
                    : [],
                directProductsCount: 0,
            },
        ];
    });
    const [railCategory, setRailCategory,] = useState(category);
const railCategoryIndex = Math.max(
  0,
  allCategories.findIndex(
    (cat) => cat.slug === railCategory
  )
);
    const [isCategorySwitching, setIsCategorySwitching,] = useState(false);
    const [pendingRailCategory, setPendingRailCategory,] = useState(null);
    const [categorySwitchDirection, setCategorySwitchDirection,] = useState(1);
    const categorySwitchTimerRef = useRef(null);
    function switchRailCategory(slug) {
        if (!slug ||
            slug === railCategory ||
            isCategorySwitching) {
            return;
        }
        const incomingRail = productRailRefs.current.get(slug);
        if (incomingRail) {
            incomingRail.style.transform =
                "translate3d(0, 0, 0)";
        }
        const currentIndex = categoryRailData.findIndex((cat) => cat.slug === railCategory);
        const targetIndex = categoryRailData.findIndex((cat) => cat.slug === slug);
        if (currentIndex < 0 ||
            targetIndex < 0) {
            return;
        }
        const direction = targetIndex > currentIndex
            ? 1
            : -1;
        if (categorySwitchTimerRef.current) {
            clearTimeout(categorySwitchTimerRef.current);
        }
        setCategorySwitchDirection(direction);
        setPendingRailCategory(slug);
        setIsCategorySwitching(true);
        categorySwitchTimerRef.current =
            setTimeout(() => {
                setRailCategory(slug);
                setPendingRailCategory(null);
                setIsCategorySwitching(false);
            }, 720);
    }
    const dragRef = useRef({
        type: null,
        pointerId: null,
        startX: 0,
        startLeft: 0,
        width: 0,
    });
    function moveCategoryGlass(index) {
    const tab = categoryTabRefs.current[index];
    const bar = categoryBarRef.current;

    if (!tab || !bar)
        return;

    setCategoryGlass({
        left: tab.offsetLeft,
        width: tab.offsetWidth,
        ready: true,
    });
}

function moveGroupGlass(index) {
    const tab = groupTabRefs.current[index];
    const bar = groupBarRef.current;

    if (!tab || !bar)
        return;

    setGroupGlass({
        left: tab.offsetLeft,
        width: tab.offsetWidth,
        ready: true,
    });
}


/* =========================================================
   LARGE MONITOR — FIXED HERO INDICATORS
   ========================================================= */

function moveFixedCategoryGlass(index) {
    const tab = fixedCategoryTabRefs.current[index];
    const bar = fixedCategoryBarRef.current;

    if (!tab || !bar)
        return;

    setCategoryGlass({
        left: tab.offsetLeft,
        width: tab.offsetWidth,
        ready: true,
    });
}

function moveFixedGroupGlass(index) {
    const tab = fixedGroupTabRefs.current[index];
    const bar = fixedGroupBarRef.current;

    if (!tab || !bar)
        return;

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
                    if (!slug)
                        return "";
                    const isDirectCategory = !cat.hasProductGroups &&
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
        if (!tab || !bar)
            return;
        const edgeGap = 12;
        const tabLeft = tab.offsetLeft;
        const tabRight = tab.offsetLeft + tab.offsetWidth;
        const visibleLeft = bar.scrollLeft;
        const visibleRight = bar.scrollLeft + bar.clientWidth;
        let nextScrollLeft = bar.scrollLeft;
        if (tabLeft < visibleLeft + edgeGap) {
            nextScrollLeft = tabLeft - edgeGap;
        }
        else if (tabRight > visibleRight - edgeGap) {
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
      categoryTabRefs.current[railCategoryIndex],
      categoryBarRef.current
    );

    scrollChipIntoView(
      groupTabRefs.current[activeGroupIndex],
      groupBarRef.current
    );
  });
}
    function startGlassDrag(type, event) {
        if (type === "category" &&
            window.matchMedia("(min-width: 1280px) and (min-height: 900px) and (orientation: landscape), (min-width: 1024px) and (max-height: 899px) and (orientation: landscape)").matches) {
            return;
        }
        const data = getDragData(type);
        const { bar, glass } = data;
        if (!bar || !glass.ready || glass.width <= 0)
            return;
        const barRect = bar.getBoundingClientRect();
        const pointerX = event.clientX - barRect.left + bar.scrollLeft;
        const insideGlass = pointerX >= glass.left && pointerX <= glass.left + glass.width;
        if (!insideGlass)
            return;
        event.preventDefault();
        dragRef.current = {
            type,
            pointerId: event.pointerId,
            startX: pointerX,
            startLeft: glass.left,
            width: glass.width,
        };
        bar.setPointerCapture?.(event.pointerId);
    }
    function moveGlassDrag(type, event) {
        const drag = dragRef.current;
        if (drag.type !== type || drag.pointerId !== event.pointerId)
            return;
        const data = getDragData(type);
        const { bar, setGlass } = data;
        if (!bar)
            return;
        event.preventDefault();
        const barRect = bar.getBoundingClientRect();
        const pointerX = event.clientX - barRect.left + bar.scrollLeft;
        const deltaX = pointerX - drag.startX;
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
        if (drag.type !== type || drag.pointerId !== event.pointerId)
            return;
        const data = getDragData(type);
        const { bar, tabs, glass, setGlass, getHref } = data;
        dragRef.current = {
            type: null,
            pointerId: null,
            startX: 0,
            startLeft: 0,
            width: 0,
        };
        if (!bar || !Array.isArray(tabs) || tabs.length === 0)
            return;
        const glassCenter = glass.left + glass.width / 2;
        let nearestIndex = 0;
        let nearestDistance = Infinity;
        tabs.forEach((tab, index) => {
            if (!tab)
                return;
            const tabCenter = tab.offsetLeft + tab.offsetWidth / 2;
            const distance = Math.abs(tabCenter - glassCenter);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = index;
            }
        });
        const nearestTab = tabs[nearestIndex];
        if (!nearestTab)
            return;
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
    useEffect(() => {
  const internalCategorySwitch = window.matchMedia(
    "(min-width: 1280px) and (min-height: 900px) and (orientation: landscape), " +
    "(min-width: 1024px) and (max-height: 899px) and (orientation: landscape), " +
    "(hover: none) and (pointer: coarse)"
  );

  if (!internalCategorySwitch.matches) {
    return;
  }
        const controller = new AbortController();
        let cancelled = false;
        async function loadCategoryRailData() {
            try {
                const response = await fetch("/api/goly-rozh/category-rail", {
                    cache: "no-store",
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error("Category rail request failed");
                }
                const data = await response.json();
                if (cancelled) {
                    return;
                }
                const categories = Array.isArray(data?.categories)
                    ? data.categories
                    : [];
                setCategoryRailData(categories);
            }
            catch (error) {
                if (error?.name === "AbortError") {
                    return;
                }
                console.error("GOLY ROZH rail data error:", error);
            }
        }
        loadCategoryRailData();
        return () => {
            cancelled = true;
            controller.abort();
        };
    }, []);
    useLayoutEffect(() => {
        let frameOne;
        let frameTwo;
        let cancelled = false;
        function refreshGlass() {
  if (cancelled)
    return;

  moveCategoryGlass(railCategoryIndex);
  moveGroupGlass(activeGroupIndex);

  scrollActiveChipsIntoView();
}
        frameOne =
            requestAnimationFrame(() => {
                refreshGlass();
                frameTwo =
                    requestAnimationFrame(() => {
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
    },
[
  safeLang,
  category,
  railCategory,
  railCategoryIndex,
  activeGroupIndex,
  allCategories.length,
  items.length,
]
);
    const fixedHeroCategory = categoryRailData.find((cat) => cat.slug === railCategory) ||
        activeCategory;
const fixedHeroHasProductGroups =
  Array.isArray(fixedHeroCategory?.productGroups) &&
  fixedHeroCategory.productGroups.length > 0;

const fixedHeroItems =
  fixedHeroHasProductGroups
    ? fixedHeroCategory.productGroups
    : Array.isArray(fixedHeroCategory?.packaging)
    ? fixedHeroCategory.packaging
    : [];
    const fixedHeroRawTitle = pickLang(fixedHeroCategory?.title, safeLang) ||
        prettySlug(railCategory);
    const fixedHeroTitle = safeLang === "en"
        ? titleCase(fixedHeroRawTitle).toUpperCase()
        : fixedHeroRawTitle;
    const fixedHeroIsLong = safeLang === "en"
        ? fixedHeroTitle.length > 11
        : fixedHeroTitle.length > 8;
    return (<main className={`mini-site-goly-rozh ${styles.page} ${bodyFont}`} dir={isRTL ? "rtl" : "ltr"} data-lang={safeLang}>
    <section className={`${styles.heroSection} ${styles.fixedHeroSection}`}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <GolyRozhSectionHeading key={`${railCategory}-${safeLang}`} className={`${styles.categoryHeading} ${fixedHeroIsLong
            ? styles.categoryHeadingLong
            : ""} ${titleFont}`} eyebrow={safeLang === "ar"
            ? "الفئة"
            : safeLang === "ku"
                ? "پۆل"
                : "CATEGORY"} titleTop={fixedHeroTitle} titleBottom="" desc="" lang={safeLang}/>
        </header>

        <GolyRozhProductNavRails
  brand={brand}
  categories={allCategories}
  groups={fixedHeroItems}
  activeCategorySlug={railCategory}
  safeLang={safeLang}
  onCategorySelect={(event, cat) => {
    const isDirectCategory =
      !cat.hasProductGroups &&
      !cat.hasPackaging &&
      cat.hasDirectProducts;

    if (isDirectCategory) {
      return;
    }

    event.preventDefault();

    switchRailCategory(cat.slug);
  }}
/>

</div>

<HeroCurve />
    </section>

    <div className={styles.masterRail}>
  {categoryRailData.map((panelCategory) => {
            const panelSlug = panelCategory.slug;
            const panelActive = panelSlug === railCategory;
            const panelIncoming = panelSlug ===
                pendingRailCategory;
            const panelHasProductGroups = Array.isArray(panelCategory.productGroups) &&
                panelCategory.productGroups
                    .length > 0;
            const panelItems = panelHasProductGroups
                ? panelCategory.productGroups
                : Array.isArray(panelCategory.packaging)
                    ? panelCategory.packaging
                    : [];
            const panelRawTitle = pickLang(panelCategory.title, safeLang) ||
                prettySlug(panelSlug);
            const panelTitle = safeLang === "en"
                ? titleCase(panelRawTitle).toUpperCase()
                : panelRawTitle;
            const panelIsLongTitle = safeLang === "en"
                ? panelTitle.length > 11
                : panelTitle.length > 8;
            return (
  <div
    key={panelSlug}
    className={`${styles.categoryPanel} ${
  panelActive
    ? styles.categoryPanelActive
    : ""
} ${
  panelIncoming
    ? styles.categoryPanelIncoming
    : ""
}`}
    style={{
                    "--goly-outgoing-end": `${-categorySwitchDirection *
                        100}vw`,
                    "--goly-incoming-start": `${categorySwitchDirection *
                        100}vw`,
                }} dir={isRTL ? "rtl" : "ltr"} data-category={panelSlug}>
              {/* =========================
                    RED TOP AREA
                   ========================= */}

              <section className={`${styles.heroSection} ${styles.panelHeroSection}`}>
                <div className={styles.shell}>
                  <header className={styles.header}>
                   <GolyRozhSectionHeading
  key={`${panelSlug}-${safeLang}-${panelActive ? "active" : "idle"}`}
  className={`${styles.categoryHeading} ${
    panelIsLongTitle ? styles.categoryHeadingLong : ""
  } ${titleFont}`}
  eyebrow={
    safeLang === "ar"
      ? "الفئة"
      : safeLang === "ku"
      ? "پۆل"
      : "CATEGORY"
  }
  titleTop={panelTitle}
  titleBottom=""
  desc=""
  lang={safeLang}
/>
                  </header>

                  {panelActive || panelIncoming ? (
  <GolyRozhProductNavRails
    brand={brand}
    categories={allCategories}
    groups={panelItems}
    activeCategorySlug={panelSlug}
    safeLang={safeLang}
    onCategorySelect={(event, cat) => {
      const isDirectCategory =
        !cat.hasProductGroups &&
        !cat.hasPackaging &&
        cat.hasDirectProducts;

      const internalCategorySwitch =
        window.matchMedia(
          "(min-width: 1280px) and (min-height: 900px) and (orientation: landscape), " +
          "(min-width: 1024px) and (max-height: 899px) and (orientation: landscape), " +
          "(hover: none) and (pointer: coarse)"
        ).matches;

      if (
        !internalCategorySwitch ||
        isDirectCategory
      ) {
        return;
      }

      event.preventDefault();

      switchRailCategory(cat.slug);
    }}
  />
) : null}

</div>

<HeroCurve />
              </section>

              {/* =========================
                    CREAM PRODUCT AREA
                   ========================= */}

              <section
  ref={panelActive ? productSectionRef : null}
  className={styles.productSection}
  data-lenis-prevent-wheel
>
  <div
    className={`${styles.shell} ${
      isCategorySwitching && panelActive
        ? styles.categoryContentOutgoing
        : ""
    } ${
      isCategorySwitching && panelIncoming
        ? styles.categoryContentIncoming
        : ""
    }`}
  >
    {panelItems.length > 0 ? (
  <ProductGroupRail
    brand={brand}
    panelSlug={panelSlug}
    safeLang={safeLang}
    isRTL={isRTL}
    items={panelItems}
    active={panelActive}
    sectionRef={productSectionRef}
    railRegistryRef={productRailRefs}
  />
) : (
  <div>
    {safeLang === "ar"
      ? "لا توجد عناصر حالياً"
      : safeLang === "ku"
      ? "هیچ بابەتێک نییە"
      : "No items available"}
  </div>
)}
</div>
</section>
</div>
);
})}
    </div>
  </main>);
}
