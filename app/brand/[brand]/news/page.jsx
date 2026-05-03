"use client";

import { useParams } from "next/navigation";
import SectionHeader from "@/components/products/SectionHeader";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function BrandNewsPage() {
  const params = useParams();
  const brand = String(params?.brand || "").toLowerCase();

  const { lang } = useLanguage();
  const isRTL = lang === "ar" || lang === "ku";
  const uiFont = lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";

  const title = lang === "ar" ? "الأخبار" : lang === "ku" ? "هەواڵەکان" : "News";
  const subtitle =
    lang === "ar"
      ? "آخر الأخبار والإعلانات"
      : lang === "ku"
      ? "نوێترین هەواڵ و ئاگادارییەکان"
      : `Latest updates from ${brand.toUpperCase()}.`;

  return (
    <main className="min-h-screen">
      <section className={`relative py-24 bg-transparent overflow-hidden isolate ${uiFont}`}>
        <div className="relative z-10 max-w-7xl mx-auto px-6" dir={isRTL ? "rtl" : "ltr"}>
          <SectionHeader title={title} subtitle={subtitle} />

          {/* فعلاً محتوا تستی تا بعداً لیست خبرها رو وصل کنیم */}
          <div className="mt-10 rounded-3xl bg-white/70 backdrop-blur-xl border border-black/10 p-6 text-zinc-600">
            <div className="text-sm font-bold">
              Brand: <span className="font-black">{brand}</span>
            </div>
            <div className="mt-2 text-sm opacity-80">Path: /brand/{brand}/news</div>
          </div>
        </div>
      </section>
    </main>
  );
}
