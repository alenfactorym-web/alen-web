"use client";

import { useMemo, useState, useEffect } from "react";
import SectionHeader from "@/components/products/SectionHeader";
import CategoryCylinder from "@/components/products/CategoryCylinder";
import { useLanguage } from "@/components/providers/LanguageProvider";

function pickLang(obj, lang) {
  if (!obj) return "";
  if (lang === "ar") return obj.ar || obj.en || "";
  if (lang === "ku") return obj.ku || obj.en || "";
  return obj.en || "";
}

export default function BrandProductsSection({ brandSlug = "alen" }) {
  const brand = String(brandSlug || "alen").toLowerCase();

  const { lang } = useLanguage();
  const isRTL = lang === "ar" || lang === "ku";
  const uiFont = lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";

  const [categories, setCategories] = useState([]);
  const [activeSlug, setActiveSlug] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        const res = await fetch(`/api/catalog/categories/${brand}`, {
          cache: "no-store",
        });

        const data = await res.json();
        if (!ignore) {
          setCategories(Array.isArray(data?.list) ? data.list : []);
        }
      } catch {
        if (!ignore) {
          setCategories([]);
        }
      }
    }

    loadCategories();

    return () => {
      ignore = true;
    };
  }, [brand]);

  const cylinderItems = useMemo(() => {
    return categories.map((c) => ({
      slug: c.slug,
      label: pickLang(c.title, lang),
    }));
  }, [categories, lang]);

  useEffect(() => {
    if (!activeSlug && cylinderItems?.[0]?.slug) {
      setActiveSlug(cylinderItems[0].slug);
    }
  }, [cylinderItems, activeSlug]);

  useEffect(() => {
    if (activeSlug && !categories.some((c) => c.slug === activeSlug)) {
      setActiveSlug(categories?.[0]?.slug || "");
    }
  }, [categories, activeSlug]);

  return (
    <section className="relative pt-20 pb-14 bg-transparent overflow-hidden isolate">
      <div className={`relative z-10 max-w-7xl mx-auto px-6 ${uiFont}`} dir={isRTL ? "rtl" : "ltr"}>
        <SectionHeader
          title={lang === "ar" ? "المنتجات" : lang === "ku" ? "بەرهەمەکان" : "Products"}
          subtitle={`Browse ${brand.toUpperCase()} product categories.`}
        />

        <div className="max-w-5xl mx-auto mt-6 mb-6">
          <CategoryCylinder
            items={cylinderItems}
            dir="ltr"
            activeSlug={activeSlug}
            onChange={setActiveSlug}
            hrefBase={`/brand/${brand}/products`}
          />
        </div>

        <div dir="ltr" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((cat) => {
            const label = pickLang(cat.title, lang);
            const isActive = activeSlug === cat.slug;

            return (
              <a
                key={cat.slug}
                href={`/brand/${brand}/products/${cat.slug}`}
                className="group relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-black/10"
              >
                <div className="h-40 bg-zinc-200 relative overflow-hidden">
                  <img
                    src={cat.image}
                    alt={label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                <div className="px-5 py-3">
                  <div className="font-black text-zinc-700 text-sm truncate">
                    {label}
                  </div>

                  <div
                    className={`
                      mt-2 h-[2.5px] w-0 rounded-full
                      bg-yellow-400 transition-all
                      ${isActive ? "w-16" : "group-hover:w-12"}
                    `}
                  />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

