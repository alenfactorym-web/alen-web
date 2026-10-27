"use client";

import Link from "next/link";
import styles from "./ProductGroupPageClient.module.css";
import AlshafiSectionHeading from "@/components/brands/alshafi/shared/AlshafiSectionHeading";
import ProductGalleryClient from "@/components/brands/alshafi/products/gallery/ProductGalleryClient";
import AlshafiProductNavRails from "@/components/brands/alshafi/products/shared/AlshafiProductNavRails";

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

export default function ProductGroupPageClient({
  brand,
  category,
  group,
  lang,
  serverItems = [],
  serverPackTitle,
  serverProductGroupsList = [],
  allCategories = [],
  page,
  perPage,
  total,
}) {
  const safeLang = ["en", "ar", "ku"].includes(lang) ? lang : "en";
  const isRTL = safeLang === "ar" || safeLang === "ku";

  const titleFont =
    safeLang === "ar" ? "font-ar-title" : safeLang === "ku" ? "ku-title" : "";

  const bodyFont =
    safeLang === "ar" ? "font-ar-body" : safeLang === "ku" ? "ku-title" : "";

  const items = Array.isArray(serverItems) ? serverItems : [];

  const productGroups = Array.isArray(serverProductGroupsList)
    ? serverProductGroupsList
    : [];

  const activeCategory =
    allCategories.find((cat) => cat.slug === category) || null;

  const rawCategoryTitle =
    pickLang(activeCategory?.title, safeLang) || prettySlug(category);

  const categoryTitle =
    safeLang === "en"
      ? titleCase(rawCategoryTitle).toUpperCase()
      : rawCategoryTitle;

  const activeGroup =
    productGroups.find((item) => item.slug === group) || null;

  const rawGroupTitle =
    pickLang(serverPackTitle, safeLang) ||
    pickLang(activeGroup?.title, safeLang) ||
    prettySlug(group);

  const groupTitle =
    safeLang === "en" ? titleCase(rawGroupTitle).toUpperCase() : rawGroupTitle;

  const isLongGroupTitle =
    safeLang === "en" ? groupTitle.length > 13 : groupTitle.length > 9;

  const currentPage = Math.max(1, Number(page || 1));
  const effectivePerPage = Math.max(1, Number(perPage || 12));
  const effectiveTotal = Math.max(0, Number(total || items.length || 0));
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / effectivePerPage));

  const backHref = `/brand/${brand}?lang=${safeLang}#products`;

  return (
    <main
      className={`mini-site-alshafi ${styles.page} ${bodyFont}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <section className={styles.section}>
        <div className={styles.shell}>
          <header className={styles.header}>
            <AlshafiSectionHeading
  autoFitMobile
  className={`${styles.categoryHeading} ${
    isLongGroupTitle ? styles.categoryHeadingLong : ""
  } ${titleFont}`}
              eyebrow={
  group === "direct"
    ? safeLang === "ar"
      ? "الفئة"
      : safeLang === "ku"
      ? "پۆل"
      : "CATEGORY"
    : categoryTitle
}
              titleTop={groupTitle}
              bottomTitle=""
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
          {(allCategories.length > 0 || productGroups.length > 0) && (
            <AlshafiProductNavRails
              brand={brand}
              categories={allCategories}
              groups={productGroups}
              activeCategorySlug={category}
              activeGroupSlug={group}
              safeLang={safeLang}
            />
          )}

          <ProductGalleryClient items={items} lang={safeLang} />

          <div className={styles.pagination}>
            <Link
              href={backHref}
              className={`${styles.pageButton} ${styles.backButton}`}
            >
              {safeLang === "ar"
                ? "الرجوع"
                : safeLang === "ku"
                ? "گەڕانەوە"
                : "Back"}
            </Link>

            {totalPages > 1 ? (
              <>
                <Link
                  href={`/brand/${brand}/products/${category}/${group}?lang=${safeLang}&page=${Math.max(
                    1,
                    currentPage - 1
                  )}`}
                  className={`${styles.pageButton} ${
                    currentPage <= 1 ? styles.pageButtonDisabled : ""
                  }`}
                  scroll={false}
                >
                  {safeLang === "ar"
                    ? "السابق"
                    : safeLang === "ku"
                    ? "پێشوو"
                    : "Prev"}
                </Link>

                <span className={styles.pageCount}>
                  {currentPage} / {totalPages}
                </span>

                <Link
                  href={`/brand/${brand}/products/${category}/${group}?lang=${safeLang}&page=${Math.min(
                    totalPages,
                    currentPage + 1
                  )}`}
                  className={`${styles.pageButton} ${
                    currentPage >= totalPages ? styles.pageButtonDisabled : ""
                  }`}
                  scroll={false}
                >
                  {safeLang === "ar"
                    ? "التالي"
                    : safeLang === "ku"
                    ? "داهاتوو"
                    : "Next"}
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}