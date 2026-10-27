"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";

import styles from "./GolyRozhProductNavRails.module.css";

function pickLang(obj, lang) {
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

export default function GolyRozhProductNavRails({
  brand,
  categories = [],
  groups = [],
  activeCategorySlug = "",
  activeGroupSlug = "",
  safeLang = "en",
  onCategorySelect,
}) {
  const categoryBarRef = useRef(null);
  const categoryTabRefs = useRef([]);

  const groupBarRef = useRef(null);
  const groupTabRefs = useRef([]);

  const dragRef = useRef({
    type: null,
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  const suppressClickRef = useRef(false);
  const suppressClickTimerRef = useRef(null);

  const [categoryIndicator, setCategoryIndicator] = useState({
    left: 0,
    width: 0,
    ready: false,
  });

  const [groupIndicator, setGroupIndicator] = useState({
    left: 0,
    width: 0,
    ready: false,
  });

  const [categoryEdges, setCategoryEdges] = useState({
    left: false,
    right: false,
  });

  const [groupEdges, setGroupEdges] = useState({
    left: false,
    right: false,
  });

  const activeCategoryIndex = Math.max(
    0,
    categories.findIndex((item) => item.slug === activeCategorySlug)
  );

  const resolvedActiveGroupSlug =
    activeGroupSlug || groups[0]?.slug || "";

  const activeGroupIndex = Math.max(
    0,
    groups.findIndex((item) => item.slug === resolvedActiveGroupSlug)
  );

  function getLabelMetrics(tab) {
    if (!tab) return null;

    const label = tab.querySelector(`.${styles.tabLabel}`);

    if (!label) {
      return {
        left: tab.offsetLeft,
        width: tab.offsetWidth,
      };
    }

    return {
      left: tab.offsetLeft + label.offsetLeft,
      width: label.offsetWidth,
    };
  }

  function moveCategoryIndicator(index) {
    const tab = categoryTabRefs.current[index];
    const metrics = getLabelMetrics(tab);

    if (!metrics) return;

    setCategoryIndicator({
      left: metrics.left,
      width: metrics.width,
      ready: true,
    });
  }

  function moveGroupIndicator(index) {
    const tab = groupTabRefs.current[index];
    const metrics = getLabelMetrics(tab);

    if (!metrics) return;

    setGroupIndicator({
      left: metrics.left,
      width: metrics.width,
      ready: true,
    });
  }

  function getRailData(type) {
    if (type === "category") {
      return {
        bar: categoryBarRef.current,
        tabs: categoryTabRefs.current,
      };
    }

    return {
      bar: groupBarRef.current,
      tabs: groupTabRefs.current,
    };
  }

  function updateRailEdges(type) {
    const { bar, tabs } = getRailData(type);

    if (!bar || !tabs?.length) return;

    const barRect = bar.getBoundingClientRect();
    const validTabs = tabs.filter(Boolean);

    if (!validTabs.length) return;

    const hasLeft = validTabs.some((tab) => {
      const rect = tab.getBoundingClientRect();
      return rect.left < barRect.left - 2;
    });

    const hasRight = validTabs.some((tab) => {
      const rect = tab.getBoundingClientRect();
      return rect.right > barRect.right + 2;
    });

    const nextEdges = {
      left: hasLeft,
      right: hasRight,
    };

    if (type === "category") {
      setCategoryEdges(nextEdges);
    } else {
      setGroupEdges(nextEdges);
    }
  }

  function scrollTabIntoView(tab, bar, behavior = "smooth") {
    if (!tab || !bar) return;

    const barRect = bar.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    if (
      tabRect.left >= barRect.left - 1 &&
      tabRect.right <= barRect.right + 1
    ) {
      return;
    }

    tab.scrollIntoView({
      behavior,
      block: "nearest",
      inline: "nearest",
    });
  }

  function snapRailToNearest(type) {
    const { bar, tabs } = getRailData(type);

    if (!bar || !tabs?.length) return;

    if (bar.scrollWidth <= bar.clientWidth + 2) {
      updateRailEdges(type);
      return;
    }

    const barRect = bar.getBoundingClientRect();
    const validTabs = tabs.filter(Boolean);

    let nearestTab = null;
    let nearestDistance = Infinity;

    validTabs.forEach((tab) => {
      const rect = tab.getBoundingClientRect();
      const distance = Math.abs(rect.left - barRect.left);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestTab = tab;
      }
    });

    if (!nearestTab) return;

    nearestTab.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });

    window.setTimeout(() => {
      updateRailEdges(type);
    }, 420);
  }

  function moveRailByArrow(type, direction) {
    const { bar, tabs } = getRailData(type);

    if (!bar || !tabs?.length) return;

    const barRect = bar.getBoundingClientRect();
    const validTabs = tabs.filter(Boolean);

    const hiddenTabs = validTabs.filter((tab) => {
      const rect = tab.getBoundingClientRect();

      if (direction === "left") {
        return rect.left < barRect.left - 2;
      }

      return rect.right > barRect.right + 2;
    });

    if (!hiddenTabs.length) return;

    let targetTab = null;

    if (direction === "left") {
      targetTab = hiddenTabs.reduce((closest, tab) => {
        if (!closest) return tab;

        const closestRect = closest.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();

        return tabRect.right > closestRect.right ? tab : closest;
      }, null);
    } else {
      targetTab = hiddenTabs.reduce((closest, tab) => {
        if (!closest) return tab;

        const closestRect = closest.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();

        return tabRect.left < closestRect.left ? tab : closest;
      }, null);
    }

    if (!targetTab) return;

    targetTab.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: direction === "left" ? "start" : "end",
    });

    window.setTimeout(() => {
      snapRailToNearest(type);
    }, 380);
  }

  function startDrag(type, event) {
    if (event.pointerType === "mouse") return;

    const { bar } = getRailData(type);

    if (!bar || bar.scrollWidth <= bar.clientWidth + 2) return;

    if (suppressClickTimerRef.current) {
      clearTimeout(suppressClickTimerRef.current);
      suppressClickTimerRef.current = null;
    }

    suppressClickRef.current = false;

    dragRef.current = {
      type,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: bar.scrollLeft,
      moved: false,
    };

    bar.setPointerCapture?.(event.pointerId);
  }

  function moveDrag(type, event) {
    const drag = dragRef.current;

    if (
      drag.type !== type ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }

    const { bar } = getRailData(type);

    if (!bar) return;

    const deltaX = event.clientX - drag.startX;

    if (Math.abs(deltaX) < 3) return;

    dragRef.current.moved = true;

    event.preventDefault();

    bar.scrollLeft = drag.startScrollLeft - deltaX;
  }

  function endDrag(type, event) {
    const drag = dragRef.current;

    if (
      drag.type !== type ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }

    const { bar } = getRailData(type);
    const didMove = drag.moved;

    dragRef.current = {
      type: null,
      pointerId: null,
      startX: 0,
      startScrollLeft: 0,
      moved: false,
    };

    if (bar?.hasPointerCapture?.(event.pointerId)) {
      bar.releasePointerCapture(event.pointerId);
    }

    if (!bar) return;

    if (didMove) {
      suppressClickRef.current = true;

      suppressClickTimerRef.current = window.setTimeout(() => {
        suppressClickRef.current = false;
        suppressClickTimerRef.current = null;
      }, 420);
    }

    snapRailToNearest(type);
  }

  function handleRailClickCapture(event) {
    if (!suppressClickRef.current) return;

    event.preventDefault();
    event.stopPropagation();
  }

  useLayoutEffect(() => {
    let cancelled = false;
    let frameOne = null;
    let frameTwo = null;

    const categoryBar = categoryBarRef.current;
    const groupBar = groupBarRef.current;

    function refresh() {
      if (cancelled) return;

      frameOne = requestAnimationFrame(() => {
        if (cancelled) return;

        moveCategoryIndicator(activeCategoryIndex);

        scrollTabIntoView(
          categoryTabRefs.current[activeCategoryIndex],
          categoryBarRef.current,
          "auto"
        );

        if (groups.length > 0) {
          moveGroupIndicator(activeGroupIndex);

          scrollTabIntoView(
            groupTabRefs.current[activeGroupIndex],
            groupBarRef.current,
            "auto"
          );
        }

        frameTwo = requestAnimationFrame(() => {
          if (cancelled) return;

          updateRailEdges("category");

          if (groups.length > 0) {
            updateRailEdges("group");
          }
        });
      });
    }

    function handleCategoryScroll() {
      updateRailEdges("category");
    }

    function handleGroupScroll() {
      updateRailEdges("group");
    }

    refresh();

    categoryBar?.addEventListener("scroll", handleCategoryScroll, {
      passive: true,
    });

    groupBar?.addEventListener("scroll", handleGroupScroll, {
      passive: true,
    });

    window.addEventListener("resize", refresh);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) refresh();
      });
    }

    return () => {
      cancelled = true;

      if (frameOne) cancelAnimationFrame(frameOne);
      if (frameTwo) cancelAnimationFrame(frameTwo);

      if (suppressClickTimerRef.current) {
        clearTimeout(suppressClickTimerRef.current);
        suppressClickTimerRef.current = null;
      }

      categoryBar?.removeEventListener("scroll", handleCategoryScroll);
      groupBar?.removeEventListener("scroll", handleGroupScroll);

      window.removeEventListener("resize", refresh);
    };
  }, [
    activeCategoryIndex,
    activeGroupIndex,
    activeCategorySlug,
    resolvedActiveGroupSlug,
    safeLang,
    categories.length,
    groups.length,
  ]);

  return (
    <div
      className={styles.rails}
      dir={safeLang === "ar" || safeLang === "ku" ? "rtl" : "ltr"}
    >
      {categories.length > 0 ? (
        <div className={styles.railShell}>
          <button
            type="button"
            className={`${styles.railArrow} ${styles.railArrowLeft} ${
              categoryEdges.left ? styles.railArrowVisible : ""
            }`}
            aria-label="Previous categories"
            onClick={() => moveRailByArrow("category", "left")}
          >
            ‹
          </button>

          <nav
            ref={categoryBarRef}
            className={styles.categoryBar}
            data-count={categories.length}
            aria-label="Categories"
            onMouseLeave={() => {
              moveCategoryIndicator(activeCategoryIndex);
            }}
            onPointerDown={(event) => startDrag("category", event)}
            onPointerMove={(event) => moveDrag("category", event)}
            onPointerUp={(event) => endDrag("category", event)}
            onPointerCancel={(event) => endDrag("category", event)}
            onClickCapture={handleRailClickCapture}
          >
            <span
              className={`${styles.indicator} ${styles.categoryIndicator}`}
              style={{
                width: `${categoryIndicator.width}px`,
                transform: `translateX(${categoryIndicator.left}px)`,
                opacity: categoryIndicator.ready ? 1 : 0,
              }}
            />

            {categories.map((cat, index) => {
              const slug = cat.slug;
              const rawLabel =
                pickLang(cat.title, safeLang) || prettySlug(slug);
              const label =
                safeLang === "en" ? titleCase(rawLabel) : rawLabel;
              const active = slug === activeCategorySlug;

              const isDirectCategory =
                !cat.hasProductGroups &&
                !cat.hasPackaging &&
                cat.hasDirectProducts;

              const href = isDirectCategory
                ? `/brand/${brand}/products/${slug}/direct?lang=${safeLang}&page=1`
                : `/brand/${brand}/products/${slug}?lang=${safeLang}`;

              return (
                <Link
                  key={slug}
                  ref={(node) => {
                    categoryTabRefs.current[index] = node;
                  }}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => {
                    moveCategoryIndicator(index);
                  }}
                  onClick={(event) => {
                    if (suppressClickRef.current) {
                      event.preventDefault();
                      return;
                    }

                    onCategorySelect?.(event, cat);
                  }}
                  className={`${styles.categoryTab} ${
                    active ? styles.categoryTabActive : ""
                  }`}
                >
                  <span className={styles.tabLabel}>{label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className={`${styles.railArrow} ${styles.railArrowRight} ${
              categoryEdges.right ? styles.railArrowVisible : ""
            }`}
            aria-label="Next categories"
            onClick={() => moveRailByArrow("category", "right")}
          >
            ›
          </button>
        </div>
      ) : null}

      {groups.length > 0 ? (
  <div
    className={`${styles.railShell} ${styles.groupRailShell}`}
    data-visible={Math.min(groups.length, 3)}
  >
    <button
      type="button"
      className={`${styles.railArrow} ${styles.railArrowLeft} ${
        groupEdges.left ? styles.railArrowVisible : ""
      }`}
            aria-label="Previous product groups"
            onClick={() => moveRailByArrow("group", "left")}
          >
            ‹
          </button>

          <nav
            ref={groupBarRef}
            className={styles.groupBar}
            data-count={groups.length}
            aria-label="Product Groups"
            onMouseLeave={() => {
              moveGroupIndicator(activeGroupIndex);
            }}
            onPointerDown={(event) => startDrag("group", event)}
            onPointerMove={(event) => moveDrag("group", event)}
            onPointerUp={(event) => endDrag("group", event)}
            onPointerCancel={(event) => endDrag("group", event)}
            onClickCapture={handleRailClickCapture}
          >
            <span
              className={`${styles.indicator} ${styles.groupIndicator}`}
              style={{
                width: `${groupIndicator.width}px`,
                transform: `translateX(${groupIndicator.left}px)`,
                opacity: groupIndicator.ready ? 1 : 0,
              }}
            />

            {groups.map((item, index) => {
              const rawLabel =
                pickLang(item.title, safeLang) || prettySlug(item.slug);
              const label =
                safeLang === "en" ? titleCase(rawLabel) : rawLabel;
              const active = item.slug === resolvedActiveGroupSlug;

              return (
                <Link
                  key={item._id || item.slug}
                  ref={(node) => {
                    groupTabRefs.current[index] = node;
                  }}
                  href={`/brand/${brand}/products/${activeCategorySlug}/${item.slug}?lang=${safeLang}&page=1`}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => {
                    moveGroupIndicator(index);
                  }}
                  onClick={(event) => {
                    if (suppressClickRef.current) {
                      event.preventDefault();
                    }
                  }}
                  className={`${styles.groupTab} ${
                    active ? styles.groupTabActive : ""
                  }`}
                >
                  <span className={styles.tabLabel}>{label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className={`${styles.railArrow} ${styles.railArrowRight} ${
              groupEdges.right ? styles.railArrowVisible : ""
            }`}
            aria-label="Next product groups"
            onClick={() => moveRailByArrow("group", "right")}
          >
            ›
          </button>
        </div>
      ) : null}
    </div>
  );
}
