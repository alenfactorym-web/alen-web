"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ProductSearch.module.css";
export default function ProductSearch({
  open,
  onClose,
  brand = "",
  lang = "en",
}) {
const [query, setQuery] = useState("");
const [searchLang, setSearchLang] = useState(lang);

const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
const [searchError, setSearchError] = useState(false);

const inputRef = useRef(null);  

  const text = {
    en: {
      title: "Find a product",
      placeholder: "Search products...",
      hint: "Start typing to find products",
      global: "Search across all brands",
      brand: "Search this brand",
    },
    ar: {
      title: "ابحث عن منتج",
      placeholder: "ابحث عن المنتجات...",
      hint: "ابدأ الكتابة للبحث عن المنتجات",
      global: "البحث في جميع العلامات التجارية",
      brand: "البحث في هذه العلامة التجارية",
    },
    ku: {
      title: "گەڕان بۆ بەرهەم",
      placeholder: "گەڕان بۆ بەرهەمەکان...",
      hint: "بۆ دۆزینەوەی بەرهەم دەست بە نووسین بکە",
      global: "گەڕان لە هەموو براندەکان",
      brand: "گەڕان لەم براندە",
    },
  }[searchLang] || {
    title: "Find a product",
    placeholder: "Search products...",
    hint: "Start typing to find products",
    global: "Search across all brands",
    brand: "Search this brand",
  };

 useEffect(() => {
  if (!open) return;

  setQuery("");
  setSearchLang(lang);

  const timer = window.setTimeout(() => {
    inputRef.current?.focus();
  }, 100);

  const onKeyDown = (event) => {
    if (event.key === "Escape") onClose();
  };

  document.addEventListener("keydown", onKeyDown);

  return () => {
    clearTimeout(timer);
    document.removeEventListener("keydown", onKeyDown);
  };
}, [open, onClose]);

useEffect(() => {
  if (!open) return;

  const body = document.body;
  const html = document.documentElement;

  const scrollY = window.scrollY;
  const previousBody = {
    overflow: body.style.overflow,
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
  };
  const previousHtmlOverflow = html.style.overflow;
  const previousScrollBehavior = html.style.scrollBehavior;

  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";
  html.style.overflow = "hidden";

  // Block page-level wheel/trackpad scrolling while allowing the results list to scroll.
  const blockBackgroundScroll = (event) => {
    const results = event.target instanceof Element
      ? event.target.closest('[data-product-search-results]')
      : null;

    if (results && event.type === "wheel") {
      const delta = event.deltaY;
      const canScrollDown = results.scrollTop + results.clientHeight < results.scrollHeight - 1;
      const canScrollUp = results.scrollTop > 0;
      if ((delta > 0 && canScrollDown) || (delta < 0 && canScrollUp)) return;
    }

    if (event.cancelable) event.preventDefault();
  };

  window.addEventListener("wheel", blockBackgroundScroll, { capture: true, passive: false });
  window.dispatchEvent(new Event("product-search:open"));

  return () => {
    Object.assign(body.style, previousBody);
    html.style.overflow = previousHtmlOverflow;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, scrollY);
    html.style.scrollBehavior = previousScrollBehavior;
    window.removeEventListener("wheel", blockBackgroundScroll, true);
    window.dispatchEvent(new Event("product-search:close"));
  };
}, [open]);
useEffect(() => {
  const value = query.trim();

  if (!open || value.length < 2) {
    setResults([]);
    setLoading(false);
    setSearchError(false);
    return;
  }

  const controller = new AbortController();

  const timer = window.setTimeout(async () => {
    setLoading(true);
    setSearchError(false);

    try {
      const params = new URLSearchParams({
        q: value,
        brand: brand || "alen",
      });

      const response = await fetch(
        `/api/product-search?${params.toString()}`,
        {
          signal: controller.signal,
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();

      if (!controller.signal.aborted) {
        setResults(
          Array.isArray(data.results) ? data.results : []
        );
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setResults([]);
        setSearchError(true);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, 250);

  return () => {
    clearTimeout(timer);
    controller.abort();
  };
}, [query, brand, open]);


  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} onPointerDown={onClose}>
     <div
  className={`${styles.panel} ${
    searchLang === "ar"
      ? styles.arabic
      : searchLang === "ku"
      ? styles.kurdish
      : styles.english
  }`}
  dir={searchLang === "en" ? "ltr" : "rtl"}
        role="dialog"
        aria-modal="true"
        aria-label={text.title}
        onPointerDown={(event) => event.stopPropagation()}
        style={{
          "--search-accent":
            brand === "goly-rozh" ? "#b01a24" : brand === "alshafi" ? "#c99a3a" : "#e5b900",
          "--search-glow": brand === "goly-rozh" ? "rgba(215, 35, 54, .27)" : brand === "alshafi" ? "rgba(201, 154, 58, .27)" : "rgba(255, 211, 36, .27)",
        }}
      >
       <div className={styles.header}>
  <div className={styles.heading}>
    <span className={styles.eyebrow}>
      {brand.replace(/-/g, " ").toUpperCase()} / PRODUCT SEARCH
    </span>

    <h2 className={styles.title}>{text.title}</h2>
  </div>

  <div className={styles.headerActions}>
    <div
      className={styles.languageSwitch}
      dir="ltr"
      aria-label="Search language"
    >
      {["en", "ar", "ku"].map((language) => (
        <button
          key={language}
          type="button"
          className={`${styles.languageButton} ${
            searchLang === language ? styles.languageActive : ""
          }`}
          aria-pressed={searchLang === language}
          onClick={() => setSearchLang(language)}
        >
          {language.toUpperCase()}
        </button>
      ))}
    </div>

    <button
      type="button"
      className={styles.close}
            onClick={onClose}
            aria-label="Close search"
             >
      ×
    </button>
  </div>
</div>

<div className={styles.inputWrap}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 4.5 4.5" />
          </svg>

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={text.placeholder}
            className={styles.input}
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className={styles.clearQuery}
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              aria-label="Clear search"
            >×</button>
          )}
        </div>

       <div className={styles.results} data-product-search-results>

  {!query.trim() && (
    <p className={styles.hint}>
      {text.hint}
    </p>
  )}

  {query.trim().length === 1 && (
    <p className={styles.hint}>
      {lang === "ar"
        ? "اكتب حرفين على الأقل"
        : lang === "ku"
        ? "لانیکەم دوو پیت بنووسە"
        : "Type at least 2 characters"}
    </p>
  )}

  {loading && (
    <p className={styles.hint}>
      {lang === "ar"
        ? "جارٍ البحث..."
        : lang === "ku"
        ? "گەڕان..."
        : "Searching..."}
    </p>
  )}

  {searchError && !loading && (
    <p className={styles.hint}>
      {lang === "ar"
        ? "حدث خطأ أثناء البحث"
        : lang === "ku"
        ? "هەڵەیەک لە گەڕاندا ڕوویدا"
        : "Something went wrong. Please try again."}
    </p>
  )}

  {!loading &&
    !searchError &&
    query.trim().length >= 2 &&
    results.length === 0 && (
      <p className={styles.hint}>
        {lang === "ar"
          ? "لم يتم العثور على منتجات"
          : lang === "ku"
          ? "هیچ بەرهەمێک نەدۆزرایەوە"
          : "No products found"}
      </p>
    )}

  {!loading && results.length > 0 && (
    <div className={styles.productResults}>
      {results.map((product) => {
        const category = product.category?.slug;

        const group =
          product.productGroup?.slug ||
          product.packaging?.productGroupSlug;

        const packaging = product.packaging?.slug;

        const destination = category
          ? `/brand/${product.brand}/products/${category}/${
              packaging || group || "direct"
            }?lang=${lang}`
          : null;

       const productName =
  product.title?.[searchLang] ||
  product.title?.en ||
  "Product";

const categoryName =
  product.category?.title?.[searchLang] ||
  product.category?.title?.en ||
  "";

        return (
          <a
            key={product._id}
            href={destination || "#"}
            onClick={(event) => {
              if (!destination) {
                event.preventDefault();
                return;
              }

              onClose();
            }}
            className={styles.productItem}
          >
            <div className={styles.productImage}>
              {product.image && (
                <img
                  src={product.image}
                  alt={productName}
                  loading="lazy"
                />
              )}
            </div>

            <div className={styles.productInfo}>
              <span className={styles.productName}>
                {productName}
              </span>

              <span className={styles.productCategory}>
                {categoryName}
              </span>

              {product.sku && (
                <span className={styles.productSku}>
                  {product.sku}
                </span>
              )}
            </div>

<span className={styles.productArrow} aria-hidden="true">
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </svg>
</span>
          </a>
        );
      })}
    </div>
  )}
</div>
           </div>
    </div>,
    document.body
  );
}