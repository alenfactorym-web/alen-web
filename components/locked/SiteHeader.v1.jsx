"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams, useParams } from "next/navigation";
import { getBrandTheme } from "@/lib/brandTheme";
import ProductSearch from "@/components/search/ProductSearch";

export default function SiteHeader(props) {
  const { lang, setLang, t } = props;
  const manualActiveUntilRef = useRef(0);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const brand = String(params?.brand || "").toLowerCase();
   const theme = getBrandTheme(brand);
  const isBrand = pathname?.startsWith("/brand/");
   const isMiniBrand = isBrand && brand && brand !== "alen";
  if (
    pathname?.startsWith("/studio") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/sanity")
  ) {
    return null;
  }

const nav = (
  isMiniBrand
    ? [
        { key: "home", href: "#home", label: t?.navHome || "Home" },
        { key: "brands", href: "#brands", label: t?.navBrands || "Brands" },
        { key: "products", href: "#products", label: t?.navProducts || "Products" },
        { key: "video", href: "#video", label: t?.navVideo || "Video" },

        // خاموش موقت؛ بعداً فقط enabled را true کن
        { key: "news", href: "#news", label: t?.navNews || "News", enabled: false },

        { key: "about", href: "#about", label: t?.navAbout || "About" },
        { key: "contact", href: "#contact", label: t?.navContact || "Contact" },
      ]
    : [
        { key: "home", href: "#top", label: t?.navHome || "Home" },
        { key: "brands", href: "#brands", label: t?.navBrands || "Brands" },
        { key: "products", href: "#products", label: t?.navProducts || "Products" },
        { key: "video", href: "#video", label: t?.navVideo || "Video" },
        { key: "news", href: "#news", label: t?.navNews || "News" },
        { key: "about", href: "/about", label: t?.navAbout || "About" },
        { key: "contact", href: "/contact", label: t?.navContact || "Contact" },
        { key: "catalog", href: "#catalog", label: t?.navCatalog || "Catalog" },
      ]
).filter((item) => item.enabled !== false);
  const openedAtRef = useRef(0);
  const [active, setActive] = useState("home");
  const [onLight, setOnLight] = useState(false);
 const [moreOpen, setMoreOpen] = useState(false);
const [searchOpen, setSearchOpen] = useState(false);
const moreRef = useRef(null);
const [brandLogoUrl, setBrandLogoUrl] = useState(null);
const [alenProductModalOpen, setAlenProductModalOpen] = useState(false);

useEffect(() => {
  const update = () => {
    setAlenProductModalOpen(
      !!document.querySelector('[data-alen-product-modal="true"]')
    );
  };

  const observer = new MutationObserver(update);
  observer.observe(document.body, { childList: true, subtree: true });

  update();

  return () => observer.disconnect();
}, []);

  // ✅ Auto-hide فقط برای موبایل/تبلت لمسی: هنگام اسکرول مخفی، بعد توقف ظاهر
  const [hideOnTouchScroll, setHideOnTouchScroll] = useState(false);
  const touchHideTimerRef = useRef(null);
  const isTouchRef = useRef(false);

  const isLightPage =
    pathname?.includes("/news") || pathname?.includes("/videos") || pathname?.includes("/products");
  const isAboutPage = pathname?.startsWith("/about");
  const isContactPage = pathname?.startsWith("/contact");

  const mobileMore = nav.filter((x) => x.key !== "home");

useEffect(() => {
  const logo =
    document
      .querySelector("[data-brand-logo]")
      ?.getAttribute("data-brand-logo") || "";

  setBrandLogoUrl(logo);
}, [pathname]);

   useEffect(() => {
  if (isMiniBrand) {
    setOnLight(true);

    if (pathname?.includes("/news")) {
      setActive("news");
      return;
    }

    if (pathname?.includes("/videos")) {
      setActive("video");
      return;
    }

    if (pathname?.includes("/products")) {
      setActive("products");
      return;
    }

    const handler = () => {
      if (moreOpen) {
        const dt = Date.now() - openedAtRef.current;

        if (dt > 450) {
          setMoreOpen(false);
        }
      }

      const ids = [
        "home",
        "brands",
        "products",
        "video",
        "about",
        "contact",
      ];

      let current = "home";

      for (const id of ids) {
        const el = document.getElementById(id);

        if (!el) continue;

        const rect = el.getBoundingClientRect();

        if (rect.top <= 180) {
          current = id;
        }
      }

      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50;

      if (isAtBottom) {
        current = "contact";
      }

      if (Date.now() > manualActiveUntilRef.current) {
        setActive(current);
      }
    };

    window.addEventListener("scroll", handler, {
      passive: true,
    });

    handler();

    return () => {
      window.removeEventListener("scroll", handler);
    };
  }

  if (isLightPage || isAboutPage || isContactPage) {
      setOnLight(true);

      if (pathname?.includes("/products")) setActive("products");
      else if (pathname?.includes("/news")) setActive("news");
      else if (pathname?.includes("/videos")) setActive("video");
      else if (isAboutPage) setActive("about");
      else if (isContactPage) setActive("contact");
      else setActive("home");

      return;
    }

    const handler = () => {
      if (moreOpen) {
        const dt = Date.now() - openedAtRef.current;
        if (dt > 450) setMoreOpen(false);
      }

      const ids = ["top", "brands", "products", "video", "news", "catalog"];
      let current = "top";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150) current = id;
      }
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (isAtBottom) current = "catalog";
      const nextActive = current === "top" ? "home" : current;

// ✅ اگر تازه کلیک کردی، فعلاً active رو با اسکرول عوض نکن (نپره)
if (Date.now() > manualActiveUntilRef.current) {
  setActive(nextActive);
}

      const yellowBar = document.getElementById("brandsYellow");
      if (yellowBar) {
        const rect = yellowBar.getBoundingClientRect();
        setOnLight(rect.top <= 80);
      } else {
        setOnLight(!(current === "top" || current === "brands"));
      }
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [isBrand, isLightPage, isAboutPage, isContactPage, pathname, moreOpen]);

  useEffect(() => {
    if (!moreOpen) return;
    function onDocPointerDown(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setMoreOpen(false);
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [moreOpen]);

  // ✅ detect touch + autohide behavior
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqTouch = window.matchMedia("(hover: none) and (pointer: coarse)");
    const update = () => {
      const tp = navigator?.maxTouchPoints ?? 0;
      isTouchRef.current = (mqTouch?.matches ?? false) || tp > 0;
      if (!isTouchRef.current) setHideOnTouchScroll(false);
    };
    update();

    if (mqTouch.addEventListener) mqTouch.addEventListener("change", update);
    else mqTouch.addListener(update);

    let lastY = window.scrollY || 0;

    const onScroll = () => {
      if (!isTouchRef.current) return;
      if (moreOpen) return;

      const y = window.scrollY || 0;

      // نزدیک top همیشه نشون بده
      if (y < 10) {
        setHideOnTouchScroll(false);
        lastY = y;
        return;
      }

      // اگر حرکت کرد -> مخفی
      if (Math.abs(y - lastY) > 2) {
        setHideOnTouchScroll(true);
        lastY = y;
      }

      // بعد از توقف اسکرول -> نمایش
      if (touchHideTimerRef.current) clearTimeout(touchHideTimerRef.current);
      touchHideTimerRef.current = setTimeout(() => {
        setHideOnTouchScroll(false);
      }, 260);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (mqTouch.removeEventListener) mqTouch.removeEventListener("change", update);
      else mqTouch.removeListener(update);
      if (touchHideTimerRef.current) clearTimeout(touchHideTimerRef.current);
    };
  }, [moreOpen]);
// ALEN — Restore correct section position after internal navigation (Cinematic Aware)
// ALEN — Restore correct section position after internal navigation (Fixed Refresh for All Sections)
useLayoutEffect(() => {
  if (pathname !== "/") return;

  const hash =
    window.location.hash.replace("#", "") ||
    sessionStorage.getItem("alenReturnSection");
  if (!hash) return;

  const validSections = [
    "top",
    "brands",
    "products",
    "video",
    "news",
    "catalog",
  ];

  if (!validSections.includes(hash)) return;

  const largeMonitor = window.matchMedia(
    "(min-width: 1280px) and (min-height: 900px) and (orientation: landscape)"
  ).matches;

  const laptop = window.matchMedia(
    "(min-width: 1367px) and (max-width: 1536px) and (max-height: 899px) and (orientation: landscape)"
  ).matches;

  const goToSection = () => {
    const el = document.getElementById(hash);
    if (!el) return;

    let targetY;

    if ((largeMonitor || laptop) && hash === "products") {
      const stage = document.getElementById(
        "alen-products-cinematic-stage"
      );

      if (stage) {
        targetY =
          stage.getBoundingClientRect().bottom +
          window.scrollY -
          window.innerHeight;
      } else {
        const rect = el.getBoundingClientRect();
        targetY = rect.top + window.scrollY;
      }

    } else {
      // 🛠️ محاسبه دقیق و مستقیم مختصات واقعی عنصر برای ویدیو، اخبار، کاتالوگ و بقیه بخش‌ها در هنگام رفرش
      const rect = el.getBoundingClientRect();
      const elTop = rect.top + window.scrollY;

      if (hash === "top") {
        targetY = 0;
      } else if (largeMonitor) {
        if (hash === "video" || hash === "news" || hash === "catalog") {
          targetY = elTop - 70; // فاصله مناسب از بالای هدر در مانیتور بزرگ
        } else {
          targetY = elTop + rect.height / 2 - window.innerHeight / 2 + 60;
        }
      } else {
        targetY = elTop - 20;
      }
    }

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: "instant",
    });
  };

  let frame = 0;
  let timer = null;

  // استفاده از تایمر کوتاه تا انیمیشن‌ها و ابعاد صفحه در مانیتور بزرگ کاملاً لود و تثبیت شوند
  timer = setTimeout(() => {
    frame = requestAnimationFrame(() => {
      goToSection();
      sessionStorage.removeItem("alenReturnSection");
    });
  }, 60);

  return () => {
    clearTimeout(timer);
    cancelAnimationFrame(frame);
  };
}, [pathname]);


const base =
  "relative px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-[11px] font-black shadow-lg transition-all duration-300" +
  " [@media(hover:none)_and_(pointer:coarse)]:px-3" +
  " [@media(hover:none)_and_(pointer:coarse)]:py-1.5" +
  " [@media(hover:none)_and_(pointer:coarse)]:text-[12px]" +
  " [@media(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(orientation:landscape)]:px-2.5" +
" [@media(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(orientation:landscape)]:py-1" +
" [@media(hover:none)_and_(pointer:coarse)_and_(min-width:768px)_and_(orientation:landscape)]:text-[11px]" +
  
  // 🌟 قفل کردن آیتم‌های منو در تبلت عمودی
  " [@media(max-width:1024px)_and_(orientation:portrait)]:!px-1.5" +
  " [@media(max-width:1024px)_and_(orientation:portrait)]:!py-0.5" +
  " [@media(max-width:1024px)_and_(orientation:portrait)]:!text-[10px]";const chip = theme?.headerChip;

const dark = chip
  ? `${chip.bg} ${chip.text} ${chip.border} ${chip.hover} backdrop-blur-md`
  : onLight
    ? "bg-zinc-200 hover:bg-zinc-300 border border-black/10 backdrop-blur-md"
    : "bg-white/12 text-zinc-100 hover:bg-white/18 border border-white/15 backdrop-blur-md";

const activePill = chip
  ? `${chip.activeBg} ${chip.activeText} ${chip.activeBorder || chip.border} backdrop-blur-md`
  : onLight
    ? "bg-zinc-300 text-zinc-900 border border-black/15 backdrop-blur-md"
    : "bg-white/18 text-white border border-white/25 backdrop-blur-md";

function PillGlow({ on }) {
  if (!on) return null;
  return (
    <>
      <span
        className="pointer-events-none absolute -inset-2 rounded-full blur-xl"
        style={{ backgroundColor: `${theme.accent}55` }}
      />
      <span
        className="pointer-events-none absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full shadow"
        style={{ backgroundColor: theme.accent }}
      />
    </>
  );
}
  function buildUrlWithLang(nextLang, extraHash = "") {
    const sp = new URLSearchParams(searchParams?.toString() || "");
    sp.set("lang", nextLang);
    return `${pathname}?${sp.toString()}${extraHash}`;
  }

  function homeWithLang() {
    return lang ? `/?lang=${lang}` : "/";
  }

 function onChangeLang(nextLang) {
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const nextUrl = buildUrlWithLang(nextLang, hash);

  if (brand === "goly-rozh" && typeof window !== "undefined") {
    window.history.replaceState(null, "", nextUrl);
    return;
  }

  router.replace(nextUrl, { scroll: false });
}

  function navHref(href) {
  const qs = lang ? `?lang=${lang}` : "";

  if (href.startsWith("#")) {
    if (isMiniBrand) return `/brand/${brand}${qs}${href}`;
    return pathname === "/" ? href : `/${qs}${href}`;
  }

  return href.includes("?") ? href : `${href}${qs}`;
}

    return (
   <>
   <header
  dir="ltr"
 className={[
  "fixed left-0 right-0 z-[9999]",

  brand === "alen" && alenProductModalOpen
    ? "pointer-events-none"
    : "",

    // ✅ موبایل/تبلت: fixed top-0 (دیگه sticky نیست)
    "top-0",

    // ✅ دسکتاپ: همون مثل قبل top-6
    brand === "alshafi"
  ? "[@media(hover:hover)_and_(pointer:fine)]:top-3"
  : brand === "goly-rozh"
    ? [
        "[@media(hover:hover)_and_(pointer:fine)]:top-6",
       "[@media(min-width:1024px)_and_(max-height:899px)_and_(orientation:landscape)]:!top-1",
"[@media(min-width:1280px)_and_(min-height:900px)_and_(orientation:landscape)]:!top-1",
      ].join(" ")
    : "[@media(hover:hover)_and_(pointer:fine)]:top-6",

    "transition-transform duration-300 ease-out",

    // ✅ autohide فقط روی تاچ
    hideOnTouchScroll ? "-translate-y-[85%]" : "translate-y-0",

    // ✅ دسکتاپ همیشه نمایش
    "[@media(hover:hover)_and_(pointer:fine)]:translate-y-0",
  ].join(" ")}
>
      {/* ✅ نوار شیشه‌ای: روشن/تیره بر اساس onLight، فقط روی touch */}
      <div
        className={[
  "w-full",

  isMiniBrand
    ? "[@media(hover:none)_and_(pointer:coarse)]:bg-transparent"
    : onLight
      ? "[@media(hover:none)_and_(pointer:coarse)]:bg-white/72"
      : "[@media(hover:none)_and_(pointer:coarse)]:bg-zinc-900/55",

  isMiniBrand
    ? "[@media(hover:none)_and_(pointer:coarse)]:backdrop-blur-0"
    : "[@media(hover:none)_and_(pointer:coarse)]:backdrop-blur-xl",

  isMiniBrand
    ? "[@media(hover:none)_and_(pointer:coarse)]:border-transparent"
    : "[@media(hover:none)_and_(pointer:coarse)]:border-b",

  isMiniBrand
    ? "[@media(hover:none)_and_(pointer:coarse)]:shadow-none"
    : "[@media(hover:none)_and_(pointer:coarse)]:shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)]",

"[@media(hover:hover)_and_(pointer:fine)]:bg-transparent",
"[@media(hover:hover)_and_(pointer:fine)]:border-transparent",
"[@media(hover:hover)_and_(pointer:fine)]:shadow-none",

brand === "alen" && alenProductModalOpen
  ? "[@media(hover:none)_and_(pointer:coarse)]:!bg-transparent [@media(hover:none)_and_(pointer:coarse)]:!border-transparent [@media(hover:none)_and_(pointer:coarse)]:!shadow-none [@media(hover:none)_and_(pointer:coarse)]:!backdrop-blur-none"
  : "",
].join(" ")}      >
        <div className="flex flex-wrap items-center justify-between px-3 md:px-4 gap-y-3 landscape:pr-1 py-2">
          <nav
  className={`flex-1 min-w-0 pointer-events-auto ${
    brand === "alen" && alenProductModalOpen ? "hidden" : ""
  }`}
>
            {/* موبایل Portrait + موبایل Landscape: منوی کشویی */}
            <div className="hidden [@media(max-width:639px)_and_(orientation:portrait)]:flex [@media(max-width:950px)_and_(orientation:landscape)]:flex items-center gap-1.5">
              <div ref={moreRef} className="relative">
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openedAtRef.current = Date.now();
                    setMoreOpen((v) => !v);
                    setActive("menu");
                  }}
                  className={[base, moreOpen ? activePill : dark].join(" ")}
                >
                  <PillGlow on={moreOpen} />
                  <span className="relative">{t?.navMenu || "Menu"}</span>
                </button>

                {moreOpen && (
                  <div
                    className="absolute left-0 top-full mt-3 w-max max-w-[72vw] rounded-2xl border border-white/20 bg-zinc-700/90 backdrop-blur-xl p-1.5 shadow-2xl z-[10000]"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    {mobileMore.map((item) => (
                      <a
                        key={item.key}
                        href={navHref(item.href)}
                        onClick={() => {
                        manualActiveUntilRef.current = Date.now() + 650; // ✅ 0.65s lock
                          setActive(item.key);
                          setMoreOpen(false);
                        }}
                        className="block rounded-xl px-3 py-2.5 text-[11px] font-black text-white hover:bg-white/10 active:bg-white/20"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* تبلت + دسکتاپ: منوی کامل */}
            <div className="alen-header-nav-full flex items-center gap-2 [@media(max-width:639px)_and_(orientation:portrait)]:hidden [@media(max-width:950px)_and_(orientation:landscape)]:hidden">
              {nav.map((item) => {
                const isActive = active === item.key;
                return (
                  <a
                    key={item.key}
                    href={navHref(item.href)}
onClick={(e) => {
  manualActiveUntilRef.current = Date.now() + 650;
  setActive(item.key);

  // ALEN: برگشت از صفحات داخلی بدون پرش اولیه Hash
  if (!isMiniBrand && pathname !== "/" && item.href?.startsWith("#")) {
    e.preventDefault();

    sessionStorage.setItem(
      "alenReturnSection",
      item.href.slice(1)
    );

    router.push(lang ? `/?lang=${lang}` : "/", {
      scroll: false,
    });

    return;
  }

  // ✅ فقط برای لینک‌های # داخل صفحه Home
  if (!isMiniBrand && pathname === "/" && item.href?.startsWith("#")) {    e.preventDefault();

    const id = item.href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;

   const rect = el.getBoundingClientRect();
const elTop = rect.top + window.scrollY;

// ALEN Homepage / Large Monitor + Laptop
const isAlenLargeMonitor =
  !isMiniBrand &&
  pathname === "/" &&
  (
    window.matchMedia(
      "(min-width: 1280px) and (min-height: 900px) and (orientation: landscape)"
    ).matches ||
    window.matchMedia(
      "(min-width: 1367px) and (max-width: 1536px) and (max-height: 899px) and (orientation: landscape)"
    ).matches
  );
const cinematicStage =
  id === "products" && isAlenLargeMonitor
    ? document.getElementById("alen-products-cinematic-stage")
    : null;

const videoStage =
  id === "video" && isAlenLargeMonitor
    ? document.querySelector("#video > div")
    : null;

let targetY;
if (cinematicStage) {
  const stageRect = cinematicStage.getBoundingClientRect();

    targetY =    stageRect.bottom +    window.scrollY -    window.innerHeight;
} else if (videoStage) {
  const stageRect = videoStage.getBoundingClientRect();

  // نمای کامل Video، کمی قبل از آزادشدن Sticky
  targetY =
    stageRect.bottom +
    window.scrollY -
    window.innerHeight -
    70;

} else { 

 const headerOffset =
    id === "products"
      ? -50
      : id === "video"
        ? -150
        : 120;

 targetY =
  id === "products" || id === "video" || id === "news"
    ? Math.max(0, elTop - headerOffset)
    : Math.max(
        0,
        elTop + rect.height / 2 -
        window.innerHeight / 2 + headerOffset / 2
      );
}

window.scrollTo({
  top: Math.max(0, targetY),
  behavior: isAlenLargeMonitor ? "instant" : "smooth",
});
  }
}}   
          className={[base, isActive ? activePill : dark].join(" ")}
style={
  isActive && theme.headerActiveBg
    ? { backgroundColor: theme.headerActiveBg, color: theme.headerActiveText || "#070707" }
    : !isActive && onLight && theme.headerOnLightText
      ? { color: theme.headerOnLightText }
      : undefined
}                  >
                    <PillGlow on={isActive} />
                    <span className="relative">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </nav>

          <div className="alen-header-tools flex items-center gap-2 shrink-0 ml-auto pointer-events-auto">
            <Link
  href={homeWithLang()}
  className="inline-flex items-center justify-center h-10 w-10 md:h-16 md:w-16"
 style={theme.headerLogoGap ? { marginInlineEnd: theme.headerLogoGap } : undefined}
>
             {(!isMiniBrand || brandLogoUrl) && (
  <img
    src={brandLogoUrl || "/logo.svg"}
    alt={brand || "Alen Factory"}
    className={`h-full w-full object-contain ${theme.headerLogoClassName || "scale-[1.3]"}`}
  />
)}
            </Link>

            {/* PRODUCT SEARCH — TRIGGER */}
            <button
              type="button"
              aria-label="Search products"
              title="Search products"
              className={[
                base,
                dark,
                "relative inline-flex items-center justify-center",
                "!w-8 !h-8 !p-0 md:!w-9 md:!h-9",
                "shrink-0",
              ].join(" ")}
              
onClick={() => {
  setMoreOpen(false);
  setSearchOpen(true);
}}            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.5 4.5" />
              </svg>
            </button>

            {["en", "ar", "ku"].map((l) => (
  <button
    key={l}
    onClick={() => onChangeLang(l)}
    className={[
      base,
      lang === l ? activePill : dark,
      "[@media(max-width:950px)_and_(orientation:landscape)]:px-2",
      "[@media(max-width:950px)_and_(orientation:landscape)]:py-1",
      "[@media(max-width:950px)_and_(orientation:landscape)]:text-[11px]",
      "[@media(max-width:767px)_and_(orientation:portrait)]:px-2",
      "[@media(max-width:767px)_and_(orientation:portrait)]:py-1",
      "[@media(max-width:767px)_and_(orientation:portrait)]:text-[11px]",
      
      // 🌟 اضافه کردن شرط تبلت عمودی (تا عرض ۱۰۲۴ پیکسل پورتریت) با علامت ! برای دکمه‌های زبان
      "[@media(max-width:1024px)_and_(orientation:portrait)]:!px-1.5",
      "[@media(max-width:1024px)_and_(orientation:portrait)]:!py-0.5",
      "[@media(max-width:1024px)_and_(orientation:portrait)]:!text-[10px]",
    ].join(" ")}
  >
    <PillGlow on={lang === l} />
    <span className="relative">{l.toUpperCase()}</span>
  </button>
))}
          </div>
        </div>

        {/* ✅ یه “نوار زیر” خیلی نازک که وقتی hide میشه هنوز یه hint بمونه */}
      {!isMiniBrand && !(brand === "alen" && alenProductModalOpen) && (
  <div
    className={[
      "h-[6px]",
      "[@media(hover:none)_and_(pointer:coarse)]:block",
      "[@media(hover:hover)_and_(pointer:fine)]:hidden",
      onLight ? "bg-black/5" : "bg-white/10",
    ].join(" ")}
  />
)}
            </div>
    </header>

    <ProductSearch
  open={searchOpen}
  onClose={() => setSearchOpen(false)}
  brand={isBrand ? brand : "alen"}
  lang={lang}
/>
  </>
  );
}
