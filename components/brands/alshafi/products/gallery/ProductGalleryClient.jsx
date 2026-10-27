"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import styles from "./ProductGalleryClient.module.css";
import AlshafiProductShowcaseModal from "./AlshafiProductShowcaseModal";

function pickLang(obj, lang) {
  if (!obj) return "";
  if (lang === "ar") return obj.ar || obj.en || "";
  if (lang === "ku") return obj.ku || obj.en || "";
  return obj.en || "";
}

export default function ProductGalleryClient({
  items = [],
  lang = "en",
}) {
  const safeLang = ["en", "ar", "ku"].includes(lang) ? lang : "en";

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const safeItems = Array.isArray(items) ? items : [];
  const total = safeItems.length;

  const openModal = useCallback((index) => {
    setActiveIndex(index);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const next = useCallback(() => {
    if (!total) return;

    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (!total) return;

    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  if (!total) {
    return (
      <div className={styles.empty}>
        {safeLang === "ar"
          ? "لا توجد منتجات حالياً"
          : safeLang === "ku"
          ? "هیچ بەرهەمێک نییە"
          : "No products available"}
      </div>
    );
  }

  return (
    <>
      <div
  className={styles.grid}
  data-count={total}
  data-lang={safeLang}
  dir="ltr"
>
        {safeItems.map((item, index) => {
          const label =
            pickLang(item.name, safeLang) ||
            pickLang(item.title, safeLang) ||
            item.label ||
            `Product ${index + 1}`;

          const src = item.image || "/fallback.png";
const isBottle = /bottle/i.test(
  String(item.productGroup?.slug || item.productGroupSlug || "")
);

          return (
           <button
  key={item.id || item._id || item.image || index}
  type="button"
  className={styles.card}
  dir={safeLang === "ar" || safeLang === "ku" ? "rtl" : "ltr"}
  onClick={() => openModal(index)}
>
              <div className={styles.imageWrap}>
                <Image
                  src={src}
                  alt={label}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className={`${styles.image} ${isBottle ? styles.bottleImage : ""}`}
                  draggable={false}
                />
              </div>

              <div className={styles.cardContent}>
                <h3>{label}</h3>
              </div>
            </button>
          );
        })}
      </div>

      <AlshafiProductShowcaseModal
        open={open}
        items={safeItems}
        activeIndex={activeIndex}
        lang={safeLang}
        onClose={closeModal}
        onNext={next}
        onPrev={prev}
      />
    </>
  );
}