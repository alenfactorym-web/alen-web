"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Settings } from "lucide-react";

const BRAND_CARD_STYLES = {
  alen: {
    card:
      "border-black/10 bg-white text-neutral-900 shadow-[0_22px_45px_-30px_rgba(0,0,0,0.28)] hover:shadow-[0_35px_70px_-45px_rgba(0,0,0,0.38)] dark:border-white/15 dark:bg-white/12 dark:backdrop-blur-xl dark:text-white dark:shadow-[0_22px_45px_-30px_rgba(0,0,0,0.45)]",
    sub: "text-neutral-500 dark:text-neutral-100/80",
    accent: "bg-[#f5c400]",
    arrow: "text-[#f5c400] dark:text-[#ffe27a]",
    title: "text-[#f5c400] dark:text-[#ffe27a]",
    chip:
      "border-black/10 bg-white/20 backdrop-blur-md shadow-[0_8px_20px_-10px_rgba(0,0,0,0.35)] text-neutral-700 hover:bg-white/45 hover:text-black hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.45)] dark:border-white/20 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/30 dark:hover:text-white",
  },
  alshafi: {
    card:
      "border-black/20 bg-white text-neutral-900 shadow-[0_22px_45px_-30px_rgba(0,0,0,0.28)] hover:shadow-[0_35px_70px_-45px_rgba(0,0,0,0.38)] dark:border-white/15 dark:bg-white/12 dark:backdrop-blur-xl dark:text-white dark:shadow-[0_22px_45px_-30px_rgba(0,0,0,0.45)]",
    sub: "text-neutral-500 dark:text-neutral-100/80",
    accent: "bg-black",
    arrow: "text-black dark:text-white",
    title: "text-black dark:text-white",
    chip:
      "border-black/20 bg-black/5 hover:bg-black/10 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20",
  },
  "goly-rozh": {
    card:
      "border-[#a6151f]/25 bg-white text-neutral-900 shadow-[0_22px_45px_-30px_rgba(0,0,0,0.28)] hover:shadow-[0_35px_70px_-45px_rgba(0,0,0,0.38)] dark:border-[#a6151f]/30 dark:bg-white/10 dark:backdrop-blur-xl dark:text-white dark:shadow-[0_22px_45px_-30px_rgba(0,0,0,0.48)]",
    sub: "text-neutral-500 dark:text-neutral-100/80",
    accent: "bg-[#a6151f]",
    arrow: "text-[#a6151f] dark:text-[#ffd6d8]",
    title: "text-[#a6151f] dark:text-[#ffd6d8]",
    chip:
      "border-[#a6151f]/20 bg-[#a6151f]/5 hover:bg-[#a6151f]/10 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20",
  },
  "goli-alen": {
    card:
      "border-[#1013a0]/20 bg-white text-neutral-900 shadow-[0_22px_45px_-30px_rgba(0,0,0,0.28)] hover:shadow-[0_35px_70px_-45px_rgba(0,0,0,0.38)] dark:border-[#1013a0]/28 dark:bg-white/10 dark:backdrop-blur-xl dark:text-white dark:shadow-[0_22px_45px_-30px_rgba(0,0,0,0.48)]",
    sub: "text-neutral-500 dark:text-neutral-100/80",
    accent: "bg-[#1013a0]",
    arrow: "text-[#1013a0] dark:text-[#dde0ff]",
    title: "text-[#1013a0] dark:text-[#dde0ff]",
    chip:
      "border-[#1013a0]/20 bg-[#1013a0]/5 hover:bg-[#1013a0]/10 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20",
  },
  "alen-plus": {
    card:
      "border-[#00aeef]/25 bg-white text-neutral-900 shadow-[0_22px_45px_-30px_rgba(0,0,0,0.28)] hover:shadow-[0_35px_70px_-45px_rgba(0,0,0,0.38)] dark:border-[#00aeef]/28 dark:bg-white/10 dark:backdrop-blur-xl dark:text-white dark:shadow-[0_22px_45px_-30px_rgba(0,0,0,0.48)]",
    sub: "text-neutral-500 dark:text-neutral-100/80",
    accent: "bg-[#00aeef]",
    arrow: "text-[#00aeef] dark:text-[#dff8ff]",
    title: "text-[#00aeef] dark:text-[#dff8ff]",
    chip:
      "border-[#00aeef]/20 bg-[#00aeef]/5 hover:bg-[#00aeef]/10 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20",
  },
};

export default function DashboardCards({ brand = "alen", accentColor = null }) {
  const searchParams = useSearchParams();
  const { lang, t } = useLanguage();

  const adminTitleFont =
    lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";

  const adminBodyFont =
    lang === "ar"
      ? "font-ar-body text-[16px] lg:text-[14px] xl:text-[16px]"
      : lang === "ku"
      ? "ku-body text-[16px] lg:text-[14px] xl:text-[16px]"
      : "text-[18px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px]";

  function withLang(href) {
    const sp = new URLSearchParams(searchParams?.toString() || "");
    sp.set("lang", lang || "en");
    const qs = sp.toString();
    return `${href}${qs ? `?${qs}` : ""}`;
  }

  const cards = [
    {
      name: t.adminBrands || "Brands",
      href: "/admin/brands",
      desc: t.adminBrandsDesc || "Manage all brands",
      onlyBrand: "alen",
    },
    {
      name: t.adminCategories || "Categories",
      href: "/admin/categories",
      desc: t.adminCategoriesDesc || "Organize product groups",
    },
    {
     name: t.adminProductGroups || "Product Groups",
     href: "/admin/product-groups",
     desc: t.adminProductGroupsDesc || "Manage product groups",
    },   
    {
      name: t.adminPackaging || "Packaging",
      href: "/admin/packaging",
      desc: t.adminPackagingDesc || "Manage packaging types",
    },
    {
      name: t.adminProducts || "Products",
      href: "/admin/products",
      desc: t.adminProductsDesc || "Create and edit products",
    },
    {
      name: t.adminNews || "News",
      href: "/admin/news",
      desc: t.adminNewsDesc || "Publish news posts",
    },
    {
      name: t.adminVideos || "Videos",
      href: "/admin/videos",
      desc: t.adminVideosDesc || "Manage video content",
    },
    {
      name: t.adminCatalog || "Catalog",
      href: "/admin/catalog",
      desc: t.adminCatalogDesc || "ALEN catalog only",
      onlyBrand: "alen",
    },
    {
      name: t.adminResetPassword || "Reset Password",
      desc: t.adminResetPasswordDesc || "Change admin password",
      href: "/admin/reset-password",
      onlyBrand: "alen",
    },
  ];

  const visibleCards = cards.filter((card) => {
    if (!card.onlyBrand) return true;
    return card.onlyBrand.toLowerCase() === (brand || "").toLowerCase();
  });

  const theme = BRAND_CARD_STYLES[brand] || BRAND_CARD_STYLES.alen;

  return (
<div
  className="
    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
    gap-4 lg:gap-4 xl:gap-4 2xl:gap-7
    max-w-[920px] xl:max-w-[1020px] 2xl:max-w-[1400px]
    mx-auto px-2 lg:px-4 2xl:px-0
    justify-items-center
  "
>      {visibleCards.map((card) => (
        <Link
          key={card.name}
          href={withLang(card.href)}
className={`group relative overflow-hidden rounded-[28px] border w-full max-w-[320px] lg:max-w-[270px] xl:max-w-[290px] 2xl:max-w-none p-6 lg:p-3 xl:p-4 2xl:p-7 text-center transition-all duration-300 hover:-translate-y-1 ${theme.card}`}
        >
          <div className="absolute right-6 top-8 lg:right-4 lg:top-5 xl:right-5 xl:top-6 text-zinc-500 dark:text-zinc-300">
            <Settings
  size={25}
  strokeWidth={2}
  className="lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-100 transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110"
/>
          </div>

          <div className="absolute inset-x-0 bottom-0 overflow-hidden">
            <div
              className={`h-2 w-full ${!accentColor ? theme.accent : ""}`}
              style={accentColor ? { backgroundColor: accentColor } : undefined}
            />
            <div className="pointer-events-none absolute inset-0 flex justify-center">
              <div className="h-full w-0 bg-white/80 blur-[3px] transition-all duration-500 ease-out group-hover:w-full" />
            </div>
          </div>

          <div className="mb-7 pr-10 lg:pr-8">
            <h3
              className={`
  font-black tracking-[0.01em] uppercase
  text-[22px] lg:text-[18px] xl:text-[20px] 2xl:text-2xl
  ${adminTitleFont}
`}
              style={accentColor ? { color: accentColor } : undefined}
            >
              {card.name}
            </h3>

            <p className={`mt-2 leading-6 font-semibold ${theme.sub} ${adminBodyFont}`}>
              {card.desc}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

