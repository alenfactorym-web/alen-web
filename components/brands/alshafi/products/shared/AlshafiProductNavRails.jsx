"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./AlshafiProductNavRails.module.css";

const pickLang = (obj, lang) => !obj ? "" : obj[lang] || obj.en || "";
const prettySlug = (slug = "") => String(slug).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
const titleCase = (value = "") => String(value).toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

export default function AlshafiProductNavRails({
  brand = "alshafi",
  categories = [],
  groups = [],
  activeCategorySlug = "",
  activeGroupSlug = "",
  safeLang = "en",
}) {
  const router = useRouter();
  const refs = useRef({ category: { bar: null, tabs: [] }, group: { bar: null, tabs: [] } });
  const gesture = useRef(null);
  const suppressClick = useRef(false);
  const timer = useRef(null);
  const [glass, setGlass] = useState({
    category: { left: 0, width: 0, ready: false },
    group: { left: 0, width: 0, ready: false },
  });
  const [edges, setEdges] = useState({
    category: { left: false, right: false },
    group: { left: false, right: false },
  });
  const categoryIndex = Math.max(0, categories.findIndex(item => item.slug === activeCategorySlug));
  const groupIndex = Math.max(0, groups.findIndex(item => item.slug === activeGroupSlug));

  const hrefFor = (type, item) => {
    if (type === "group") return `/brand/${brand}/products/${activeCategorySlug}/${item.slug}?lang=${safeLang}&page=1`;
    const direct = !item.hasProductGroups && !item.hasPackaging && item.hasDirectProducts;
    return direct
      ? `/brand/${brand}/products/${item.slug}/direct?lang=${safeLang}&page=1`
      : `/brand/${brand}/products/${item.slug}?lang=${safeLang}`;
  };

  function moveGlass(type, index) {
    const tab = refs.current[type].tabs[index];
    if (!tab) return;
    setGlass(prev => ({ ...prev, [type]: { left: tab.offsetLeft, width: tab.offsetWidth, ready: true } }));
  }

  function updateEdges(type) {
    const { bar, tabs } = refs.current[type];
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const valid = tabs.filter(Boolean);
    const left = valid.some(tab => tab.getBoundingClientRect().left < rect.left - 2);
    const right = valid.some(tab => tab.getBoundingClientRect().right > rect.right + 2);
    setEdges(prev => {
      if (prev[type].left === left && prev[type].right === right) return prev;
      return { ...prev, [type]: { left, right } };
    });
  }

  function showTab(type, index, behavior = "smooth") {
    const { bar, tabs } = refs.current[type];
    const tab = tabs[index];
    if (!bar || !tab) return;
    const b = bar.getBoundingClientRect();
    const t = tab.getBoundingClientRect();
    if (t.left < b.left || t.right > b.right) {
      tab.scrollIntoView({ behavior, block: "nearest", inline: "nearest" });
    }
  }

  function moveByArrow(type, dir) {
    const { bar, tabs } = refs.current[type];
    if (!bar) return;
    const b = bar.getBoundingClientRect();
    const hidden = tabs.filter(Boolean).filter(tab => {
      const r = tab.getBoundingClientRect();
      return dir === "left" ? r.left < b.left - 2 : r.right > b.right + 2;
    });
    if (!hidden.length) return;
    const target = dir === "left" ? hidden[hidden.length - 1] : hidden[0];
    target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }

  function onPointerDown(type, event) {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    const { bar } = refs.current[type];
    if (!bar) return;
    const isScrollable = bar.scrollWidth > bar.clientWidth + 2;
    const g = glass[type];
    const x = event.clientX - bar.getBoundingClientRect().left + bar.scrollLeft;
    const onGlass = g.ready && x >= g.left && x <= g.left + g.width;
    if (!isScrollable && !onGlass) return;
    gesture.current = {
  type,
  pointerId: event.pointerId,
  startX: event.clientX,
  scroll: bar.scrollLeft,
  left: g.left,
  width: g.width,
  onGlass,
  moved: false,
};
    if (timer.current) clearTimeout(timer.current);
suppressClick.current = false;
  }

  function onPointerMove(type, event) {
    const g = gesture.current;
    if (!g || g.type !== type || g.pointerId !== event.pointerId) return;
    const { bar } = refs.current[type];
    if (!bar) return;
    const dx = event.clientX - g.startX;
if (Math.abs(dx) < 4) return;

if (!g.moved) {
  g.moved = true;
  bar.setPointerCapture?.(event.pointerId);
}

if (event.cancelable) event.preventDefault();
    if (g.onGlass) {
      const next = Math.max(0, Math.min(bar.scrollWidth - g.width, g.left + dx));
      setGlass(prev => ({ ...prev, [type]: { left: next, width: g.width, ready: true } }));
      if (next < bar.scrollLeft + 20) bar.scrollLeft = next - 20;
      if (next + g.width > bar.scrollLeft + bar.clientWidth - 20) bar.scrollLeft = next + g.width - bar.clientWidth + 20;
    } else {
      bar.scrollLeft = g.scroll - dx;
    }
  }

  function onPointerUp(type, event) {
    const g = gesture.current;
    if (!g || g.type !== type || g.pointerId !== event.pointerId) return;
    gesture.current = null;
    const { bar, tabs } = refs.current[type];
    if (bar?.hasPointerCapture?.(event.pointerId)) bar.releasePointerCapture(event.pointerId);
    if (!bar) return;
    if (!g.moved) return;
    suppressClick.current = true;
    timer.current = window.setTimeout(() => { suppressClick.current = false; }, 420);
    if (g.onGlass) {
      const center = glass[type].left + glass[type].width / 2;
      let nearest = 0;
      let distance = Infinity;
      tabs.forEach((tab, i) => {
        if (!tab) return;
        const d = Math.abs(tab.offsetLeft + tab.offsetWidth / 2 - center);
        if (d < distance) { nearest = i; distance = d; }
      });
      moveGlass(type, nearest);
      const item = (type === "category" ? categories : groups)[nearest];
      if (item) router.push(hrefFor(type, item));
      return;
    }
    const barLeft = bar.getBoundingClientRect().left;
    const nearestTab = tabs.filter(Boolean).reduce((best, tab) =>
      !best || Math.abs(tab.getBoundingClientRect().left - barLeft) < Math.abs(best.getBoundingClientRect().left - barLeft) ? tab : best, null);
    nearestTab?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  useLayoutEffect(() => {
    let cancelled = false;
    const bars = [refs.current.category.bar, refs.current.group.bar];
    const refresh = () => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (cancelled) return;
        moveGlass("category", categoryIndex);
        moveGlass("group", groupIndex);
        showTab("category", categoryIndex, "auto");
        showTab("group", groupIndex, "auto");
        requestAnimationFrame(() => {
          if (!cancelled) { updateEdges("category"); updateEdges("group"); }
        });
      });
    };
    refresh();
    const onCategoryScroll = () => updateEdges("category");
    const onGroupScroll = () => updateEdges("group");
    bars[0]?.addEventListener("scroll", onCategoryScroll, { passive: true });
    bars[1]?.addEventListener("scroll", onGroupScroll, { passive: true });
    window.addEventListener("resize", refresh);
    document.fonts?.ready?.then(refresh);
    return () => {
      cancelled = true;
      bars[0]?.removeEventListener("scroll", onCategoryScroll);
      bars[1]?.removeEventListener("scroll", onGroupScroll);
      window.removeEventListener("resize", refresh);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [safeLang, activeCategorySlug, activeGroupSlug, categoryIndex, groupIndex, categories.length, groups.length]);

  function rail(type, items, activeSlug) {
    if (!items.length) return null;
    return (
      <div className={`${styles.railShell} ${type === "group" ? styles.groupRailShell : ""}`}>
        <button className={`${styles.arrow} ${styles.leftArrow} ${edges[type].left ? styles.visible : ""}`}
          type="button" aria-label={type === "category" ? "Previous categories" : "Previous product groups"}
          tabIndex={edges[type].left ? 0 : -1} onClick={() => moveByArrow(type, "left")}>‹</button>
        <nav ref={node => { refs.current[type].bar = node; }}
          className={`${styles.bar} ${type === "category" ? styles.categoryBar : styles.groupBar}`}
          data-count={items.length} aria-label={type === "category" ? "Categories" : "Product groups"}
          onPointerDown={event => onPointerDown(type, event)}
          onPointerMove={event => onPointerMove(type, event)}
          onPointerUp={event => onPointerUp(type, event)}
          onPointerCancel={event => onPointerUp(type, event)}
          onMouseLeave={() => { if (!gesture.current) moveGlass(type, type === "category" ? categoryIndex : groupIndex); }}
          onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); } }}>
          <span className={styles.glass} style={{ width: glass[type].width,
            transform: `translateX(${glass[type].left}px)`, opacity: glass[type].ready ? 1 : 0 }} />
          {items.map((item, index) => {
            const raw = pickLang(item.title, safeLang) || prettySlug(item.slug);
            const label = safeLang === "en" ? titleCase(raw) : raw;
            return <Link key={item._id || item.slug} ref={node => { refs.current[type].tabs[index] = node; }}
              href={hrefFor(type, item)} dir={safeLang === "en" ? "ltr" : "rtl"}
              className={`${styles.tab} ${type === "category" ? styles.categoryTab : styles.groupTab} ${item.slug === activeSlug ? styles.active : ""}`}
              aria-current={item.slug === activeSlug ? "page" : undefined}
              onMouseEnter={() => { if (!gesture.current) moveGlass(type, index); }}>
              {label}
            </Link>;
          })}
        </nav>
        <button className={`${styles.arrow} ${styles.rightArrow} ${edges[type].right ? styles.visible : ""}`}
          type="button" aria-label={type === "category" ? "Next categories" : "Next product groups"}
          tabIndex={edges[type].right ? 0 : -1} onClick={() => moveByArrow(type, "right")}>›</button>
      </div>
    );
  }

  return <div className={styles.rails} dir="ltr">
    {rail("category", categories, activeCategorySlug)}
    {rail("group", groups, activeGroupSlug)}
  </div>;
}
