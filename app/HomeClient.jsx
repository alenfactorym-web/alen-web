"use client";

import { useLayoutEffect } from "react";
import { Hero, BrandSlider } from "@/components/locked";
import { useLanguage } from "@/components/providers/LanguageProvider";
import VideoSectionV1 from "@/components/locked/VideoSection.v1";
import NewsSectionV1 from "@/components/locked/NewsSection.v1";
import CatalogSectionV1 from "@/components/locked/CatalogSection.v1";
import BrandProductsClient from "@/app/brand/[brand]/products/ui.client";

export default function HomeClient({ initialCategories }) {
  const { lang, t } = useLanguage();

useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    window.history.scrollRestoration = "manual";

    const navType = window.performance?.getEntriesByType?.("navigation")?.[0]?.type;

    if (navType === "back_forward") {
      const timer = setTimeout(() => {
        const el = document.getElementById("products");
        if (el) {
          // محاسبه مکان دقیق نسبت به اسکرول فعلی
          const rect = el.getBoundingClientRect();
          const targetY = rect.top + window.scrollY;
          
          // عدد 120 را کم می‌کنیم تا تیتر دقیقا زیر هدر نچسبد و کمی پایین‌تر باشد
          window.scrollTo({
            top: targetY - 120, 
            behavior: "instant"
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <main className="min-h-screen">
      <div id="top" />
      <Hero t={t} lang={lang} />

      <div className="relative">
        <div className="relative z-10 flex flex-col">
          <section id="brands" className="scroll-mt-24">
            <BrandSlider t={t} lang={lang} />
          </section>

          <section id="products" className="scroll-mt-1">
            <BrandProductsClient brand="alen" initialCategories={initialCategories} />
          </section>

          <section id="video" className="scroll-mt-24">
            <VideoSectionV1 t={t} lang={lang} />
          </section>

          <section id="news" className="scroll-mt-32">
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

