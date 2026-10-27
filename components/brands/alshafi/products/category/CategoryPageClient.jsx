"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./CategoryPageClient.module.css";
import AlshafiSectionHeading from "@/components/brands/alshafi/shared/AlshafiSectionHeading";
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

export default function CategoryPageClient({
  brand,
  category,
  lang,
  initialProductGroups = [],
  initialPackaging = [],
  allCategories = [],
}) {
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
  autoFitMobile
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
          {(allCategories.length > 0 || items.length > 0) && (
  <AlshafiProductNavRails
    brand={brand}
    categories={allCategories}
    groups={items}
    activeCategorySlug={category}
    activeGroupSlug=""
    safeLang={safeLang}
  />
)}

{items.length > 0 ? (
  <>
    <div className={styles.grid}>
      {items.map((item, index) => {                  const rawLabel =
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