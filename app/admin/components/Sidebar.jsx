"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";

const SIDEBAR_STYLES = {
  alen: {
    shell:
      "bg-white border-black/10 dark:border-white/15 dark:bg-white/10 dark:backdrop-blur-xl dark:shadow-[0_22px_45px_-30px_rgba(0,0,0,0.45)]",
    item:
      "text-zinc-500 hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/10",
    active:
      "bg-black/5 text-zinc-700 dark:bg-white/10 dark:text-white",
    accent: "bg-yellow-400",
  },
  alshafi: {
    shell:
      "bg-[#fffdfa] border-black/10 dark:border-white/15 dark:bg-white/10 dark:backdrop-blur-xl dark:shadow-[0_22px_45px_-30px_rgba(0,0,0,0.45)]",
    item:
      "text-zinc-500 hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/10",
    active:
      "bg-black/5 text-zinc-700 dark:bg-white/10 dark:text-white",
    accent: "bg-black",
  },
  "goly-rozh": {
    shell:
      "bg-[#fffdfd] border-[#a6151f]/25 dark:border-[#a6151f]/30 dark:bg-white/10 dark:backdrop-blur-xl dark:shadow-[0_22px_45px_-30px_rgba(0,0,0,0.48)]",
    item:
      "text-zinc-500 hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/10",
    active:
      "bg-black/5 text-zinc-700 dark:bg-white/10 dark:text-white",
    accent: "bg-[#a6151f]",
  },
  "goli-alen": {
    shell:
      "bg-[#fcfdff] border-[#1013a0]/20 dark:border-[#1013a0]/28 dark:bg-white/10 dark:backdrop-blur-xl dark:shadow-[0_22px_45px_-30px_rgba(0,0,0,0.48)]",
    item:
      "text-zinc-500 hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/10",
    active:
      "bg-black/5 text-zinc-700 dark:bg-white/10 dark:text-white",
    accent: "bg-[#1013a0]",
  },
  "alen-plus": {
    shell:
      "bg-[#fbfeff] border-[#00aeef]/25 dark:border-[#00aeef]/28 dark:bg-white/10 dark:backdrop-blur-xl dark:shadow-[0_22px_45px_-30px_rgba(0,0,0,0.48)]",
    item:
      "text-zinc-500 hover:bg-black/5 dark:text-white/90 dark:hover:bg-white/10",
    active:
      "bg-black/5 text-zinc-700 dark:bg-white/10 dark:text-white",
    accent: "bg-[#00aeef]",
  },
};

function PillGlow({ on }) {
  if (!on) return null;

  return (
    <>
      <span className="pointer-events-none absolute -inset-1 rounded-full bg-white/20 blur-lg" />
      <span className="pointer-events-none absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-yellow-400 shadow-sm" />
    </>
  );
}

export default function Sidebar({ brand, accentColor }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { lang, t } = useLanguage();

  const adminTitleFont =
    lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";

  function withLang(href) {
    const sp = new URLSearchParams(searchParams?.toString() || "");
    sp.set("lang", lang || "en");
    const qs = sp.toString();
    return `${href}${qs ? `?${qs}` : ""}`;
  }

  const baseItems = [
    { id: "home", name: t.adminHome || "Home", href: "/admin/home" },
    ...(brand === "alen"
      ? [{ id: "brands", name: t.adminBrands || "Brands", href: "/admin/brands" }]
      : []),
    { id: "categories", name: t.adminCategories || "Categories", href: "/admin/categories" },
    { id: "product-groups", name: t.adminProductGroups || "Product Groups", href: "/admin/product-groups" },
    { id: "packaging", name: t.adminPackaging || "Packaging", href: "/admin/packaging" },
    { id: "products", name: t.adminProducts || "Products", href: "/admin/products" },
    { id: "news", name: t.adminNews || "News", href: "/admin/news" },
    { id: "videos", name: t.adminVideos || "Videos", href: "/admin/videos" },
  ];

  const alenOnlyItems = [
    { id: "catalog", name: t.adminCatalog || "Catalog", href: "/admin/catalog" },
    { id: "reset-password", name: t.adminResetPassword || "Reset Password", href: "/admin/reset-password" },
  ];

  const items = brand === "alen" ? [...baseItems, ...alenOnlyItems] : baseItems;
  const theme = SIDEBAR_STYLES[brand] || SIDEBAR_STYLES.alen;

  const currentSection =
    pathname === "/admin" ? "home" : pathname.split("/")[2] || "home";

  return (
    <aside className="flex w-[240px] lg:w-[200px] xl:w-[220px] 2xl:w-[240px] shrink-0 self-start sticky top-6 h-fit">
      <div
        className={`relative flex-1 overflow-hidden rounded-[28px] border p-5 lg:p-3 xl:p-4 2xl:p-5 shadow-[0_22px_45px_-30px_rgba(0,0,0,0.18)] ${theme.shell}`}
      >
        <nav className="space-y-2">
          {items.map((item) => {
            const isActive = currentSection === item.id;

            return (
              <Link
                key={item.id}
                href={withLang(item.href)}
                className={`relative block overflow-hidden rounded-2xl px-4 py-3 text-sm font-black transition-all duration-300 ${
                  isActive ? theme.active : theme.item
                } ${adminTitleFont}`}
              >
                <PillGlow on={isActive} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-0 bottom-0 overflow-hidden">
          <div
            className={`h-2 w-full ${!accentColor ? theme.accent : ""}`}
            style={accentColor ? { backgroundColor: accentColor } : undefined}
          />
        </div>
      </div>
    </aside>
  );
}

