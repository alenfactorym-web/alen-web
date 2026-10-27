"use client";

import { useLayoutEffect } from "react";
import { Hero, BrandSlider } from "@/components/locked";
import { useLanguage } from "@/components/providers/LanguageProvider";
import VideoSectionV1 from "@/components/locked/VideoSection.v1";
import NewsSectionV1 from "@/components/locked/NewsSection.v1";
import CatalogSectionV1 from "@/components/locked/CatalogSection.v1";
import BrandProductsClient from "@/app/brand/[brand]/products/ui.client";

export default function HomeClient({ initialCategories, brands }) {
  const { lang, t } = useLanguage();

useLayoutEffect(() => {
  if (typeof window === "undefined") return;

  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = "manual";
  }

  // اگر هش در URL وجود دارد (مثل #products یا بخش‌های دیگر)، آن را پاک کن تا مرورگر روی آن قفل نکند
  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  const navType = window.performance?.getEntriesByType?.("navigation")?.[0]?.type;

  // اگر صفحه رفرش شد یا کاربر برگشت، حتماً بفرست بالا و نگذار به هش قبلی بپرد
  if (navType === "reload" || navType === "back_forward") {
    window.scrollTo({ top: 0, behavior: "instant" });
    sessionStorage.clear();
    
    // یک‌بار دیگر برای اطمینان بعد از رندر کامل
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }
}, []);  return (
    <main className="min-h-screen">
      <div id="top" />
      <Hero t={t} lang={lang} />

      <div className="relative">
        <div className="relative flex flex-col">
          <section id="brands" className="scroll-mt-24">
            <BrandSlider t={t} lang={lang} brands={brands} />
          </section>

          <section id="products" className="scroll-mt-1">
            <BrandProductsClient brand="alen" initialCategories={initialCategories} />
          </section>

          <section id="video" className="scroll-mt-24">
            <VideoSectionV1 t={t} lang={lang} />
          </section>

<section className="scroll-mt-32">
  <NewsSectionV1 lang={lang} />
</section>
          <div className="h-20" />

          <section id="catalog" className="scroll-mt-40">
            <CatalogSectionV1 t={t} lang={lang} />
          </section>
        </div>
      </div>
    </main>
  );
}

