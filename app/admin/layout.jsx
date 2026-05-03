"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Sidebar from "./components/Sidebar";
import BrandSelector from "./components/BrandSelector";
import ThemeProvider from "./components/ThemeProvider";
import ThemeToggle from "./components/ThemeToggle";
import { AdminBrandProvider } from "./components/AdminBrandContext";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useRouter, usePathname } from "next/navigation";

const BRAND_LOGOS = {
  alen: "/logos/logo.svg",
  alshafi: "/logos/alshafi.png",
  "goly-rozh": "/logos/golyrozh.png",
  "goli-alen": "/logos/golialen.png",
  "alen-plus": "/logos/alenplus.png",
};

const BRAND_ACCENTS = {
  alen: "#f5c400",
  alshafi: "#000000",
  "goly-rozh": "#a6151f",
  "goli-alen": "#1013a0",
  "alen-plus": "#00aeef",
};

const BRAND_STYLES = {
  alen: {
    shell: "bg-[#f5f6f7] text-black dark:bg-[#6a717a] dark:text-white",
    panel:
      "bg-black/[0.05] border-black/5 dark:bg-white/[0.08] dark:border-white/10",
  },
  alshafi: {
    shell: "bg-[#fbfaf7] text-black dark:bg-[#3a3a3a] dark:text-white",
    panel:
      "bg-black/[0.05] border-black/10 dark:bg-white/10 dark:border-white/20 backdrop-blur-xl",
  },
  "goly-rozh": {
    shell: "bg-[#faf8f8] text-black dark:bg-[#6a2a2f] dark:text-white",
    panel:
      "bg-black/[0.05] border-[#a6151f]/20 dark:bg-white/[0.08] dark:border-[#a6151f]/30",
  },
  "goli-alen": {
    shell: "bg-[#f8fafc] text-black dark:bg-[#2f3290] dark:text-white",
    panel:
      "bg-black/[0.05] border-[#1013a0]/20 dark:bg-white/[0.08] dark:border-[#1013a0]/30",
  },
  "alen-plus": {
    shell: "bg-[#f6fbff] text-black dark:bg-[#1f82a8] dark:text-white",
    panel:
      "bg-black/[0.05] border-[#00aeef]/20 dark:bg-white/[0.08] dark:border-[#00aeef]/30",
  },
};

function hexToRgb(hex) {
  if (!hex) return null;

  let value = hex.replace("#", "").trim();

  if (value.length === 3) {
    value = value
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (value.length !== 6) return null;

  const num = Number.parseInt(value, 16);

  if (Number.isNaN(num)) return null;

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbaFromHex(hex, alpha, fallback) {
  const rgb = hexToRgb(hex);
  if (!rgb) return fallback;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function mixHex(hex, targetHex, amount, fallback) {
  const source = hexToRgb(hex);
  const target = hexToRgb(targetHex);

  if (!source || !target) return fallback;

  const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));

  const r = clamp(source.r + (target.r - source.r) * amount);
  const g = clamp(source.g + (target.g - source.g) * amount);
  const b = clamp(source.b + (target.b - source.b) * amount);

  return `rgb(${r}, ${g}, ${b})`;
}

function isLightColor(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;

  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness >= 160;
}

function LanguageChips() {
  const { lang, setLang } = useLanguage();

  function PillGlow({ on }) {
    if (!on) return null;

    return (
      <>
        <span className="pointer-events-none absolute -inset-2 rounded-full bg-yellow-400/35 blur-xl" />
        <span className="pointer-events-none absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-yellow-400 shadow" />
      </>
    );
  }

  const base =
    "relative px-3 py-2 text-xs font-black rounded-full border shadow-sm backdrop-blur-md transition";

  const idle =
    "border-black/10 bg-white/90 text-zinc-500 hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20";

  const active =
    "border-black/20 bg-[#e7e2c9] text-zinc-900 dark:border-white/30 dark:bg-white/20 dark:text-white";

  return (
    <div className="flex items-center gap-2">
      {["en", "ar", "ku"].map((l) => (
        <button
          key={l}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLang(l);
          }}
          className={`${base} ${lang === l ? active : idle}`}
        >
          <PillGlow on={lang === l} />
          <span className="relative">{l.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}

export default function AdminLayout({ children }) {
  const [brand, setBrand] = useState("alen");
  const [mounted, setMounted] = useState(false);
  const [brands, setBrands] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const { lang, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  }

  const adminTitleFont =
    lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function syncThemeState() {
      setIsDark(document.documentElement.classList.contains("dark"));
    }

    syncThemeState();

    const observer = new MutationObserver(syncThemeState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function loadBrands() {
      try {
        const res = await fetch("/api/admin/brands", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          console.error("ADMIN LAYOUT BRANDS LOAD ERROR:", data);
          return;
        }

        const list = Array.isArray(data) ? data : [];
        setBrands(list);

        if (!list.length) return;

        const hasCurrentBrand = list.some((item) => item.slugValue === brand);

        if (!hasCurrentBrand) {
          setBrand("alen");
        }
      } catch (error) {
        console.error("ADMIN LAYOUT BRANDS FETCH ERROR:", error);
      }
    }

    loadBrands();
  }, [brand]);

  if (!mounted) return null;

  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  const activeBrand = brands.find((item) => item.slugValue === brand);
  const knownBrandStyle = BRAND_STYLES[brand] || null;
  const activeBrandLogo =
    activeBrand?.logoUrl || BRAND_LOGOS[brand] || "/logos/logo.svg";
  const accentColor = activeBrand?.color || BRAND_ACCENTS[brand] || "#f5c400";

  const dynamicShellStyle = knownBrandStyle
    ? undefined
    : {
        backgroundColor: isDark
          ? mixHex(accentColor, "#101418", 0.72, "#6a717a")
          : mixHex(accentColor, "#ffffff", 0.86, "#f5f6f7"),
      };

  const dynamicPanelStyle = knownBrandStyle
    ? undefined
    : {
        backgroundColor: isDark
          ? rgbaFromHex(accentColor, 0.16, "rgba(255,255,255,0.08)")
          : rgbaFromHex(accentColor, 0.08, "rgba(0,0,0,0.05)"),
        borderColor: isDark
          ? rgbaFromHex(accentColor, 0.26, "rgba(255,255,255,0.10)")
          : rgbaFromHex(accentColor, 0.20, "rgba(0,0,0,0.05)"),
      };

  return (
    <ThemeProvider>
      <AdminBrandProvider value={{ brand, setBrand, accentColor }}>
        <div
          className={`relative min-h-screen overflow-hidden ${
            knownBrandStyle ? knownBrandStyle.shell : "text-black dark:text-white"
          }`}
          style={dynamicShellStyle}
        >
          {brand === "alen" && (
            <div
              className="pointer-events-none absolute inset-0 z-0 opacity-[0.65] dark:opacity-[0.65]"
              style={{
                backgroundImage: "url('/patterns/pattern.png')",
                backgroundRepeat: "repeat",
                backgroundSize: "700px",
                backgroundPosition: "center",
              }}
            />
          )}

          <div className="relative z-10 px-8 pb-14 pt-8">
            <div className="relative min-h-[180px]">
              <div className="absolute left-8 top-8 flex items-center gap-3">
                <BrandSelector brand={brand} setBrand={setBrand} />
                <ThemeToggle />

                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-black/10 px-4 py-2 text-sm font-bold shadow-sm transition hover:shadow dark:border-white/20"
                  style={{
                    backgroundColor: accentColor,
                    color: isLightColor(accentColor) ? "black" : "white",
                  }}
                >
                  Logout
                </button>
              </div>

              <div className="absolute right-8 top-8">
                <LanguageChips />
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative h-42 w-42">
                  <Image
                    src={activeBrandLogo}
                    alt="Brand logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                <h1
                  className={`mt-4 text-3xl font-black tracking-[-0.03em] text-zinc-500 dark:text-white md:text-4xl ${adminTitleFont}`}
                >
                  {t.adminDashboard || "Admin Dashboard"}
                </h1>

                <div className="mx-auto mt-2 h-[22px] w-[220px]">
                  <svg viewBox="0 0 200 30" className="h-full w-full">
                    <path
                      d="M10 20 C 60 5, 140 5, 190 20"
                      fill="none"
                      stroke={accentColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>

                 {pathname !== "/admin/home" && (
  <div className="mt-3 flex justify-center">
    <h2
      className={`font-black uppercase tracking-tight whitespace-nowrap text-zinc-500 dark:text-white ${pathname.split("/")[2] === "reset-password" ? "text-3xl" : "text-3xl"} ${adminTitleFont}`}
    >
      {{
  home: t.adminHome || "Home",
  brands: t.adminBrands || "Brands",
  categories: t.adminCategories || "Categories",
  "product-groups": t.adminProductGroups || "Product Groups",
  packaging: t.adminPackaging || "Packaging",
  products: t.adminProducts || "Products",
  news: t.adminNews || "News",
  videos: t.adminVideos || "Videos",
  catalog: t.adminCatalog || "Catalog",
  "reset-password": brand === "alen" ? t.adminResetPassword || "Reset Password" : "",
}[pathname.split("/")[2]] || ""}
    </h2>
  </div>
)}
                </div>
              </div>
            </div>

            <div
            className={`
  mx-auto mt-16 lg:mt-12 xl:mt-14
  flex items-stretch
  max-w-[1460px] lg:max-w-[1100px] xl:max-w-[1250px] 2xl:max-w-[1460px]
  rounded-[38px] lg:rounded-[26px] xl:rounded-[30px] 2xl:rounded-[38px]
  border
  p-7 lg:p-4 xl:p-5 2xl:p-7
  shadow-[0_30px_70px_-40px_rgba(0,0,0,0.35)]
  lg:shadow-[0_20px_40px_-30px_rgba(0,0,0,0.25)]
  backdrop-blur-md
  ${knownBrandStyle ? knownBrandStyle.panel : ""}
`}
              style={dynamicPanelStyle}
            >
              <Sidebar brand={brand} accentColor={accentColor} />
              <div className="min-w-0 flex-1 pl-7">{children}</div>
            </div>
          </div>

          <div
            className="absolute inset-x-0 bottom-0 z-10 h-8"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </AdminBrandProvider>
    </ThemeProvider>
  );
}

