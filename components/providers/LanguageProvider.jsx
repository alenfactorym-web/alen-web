"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { translations } from "@/lib/translations";

const LanguageContext = createContext(null);

const LANGS = ["en", "ar", "ku"];

function normalizeLang(v) {
  const s = (v || "en").toString().toLowerCase();
  return LANGS.includes(s) ? s : "en";
}

export function LanguageProvider({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lang = normalizeLang(searchParams?.get("lang"));

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {}
  }, [lang]);

    useEffect(() => {
    if (typeof window === "undefined") return;

    const currentUrl = new URL(window.location.href);
    const urlLang = normalizeLang(currentUrl.searchParams.get("lang"));

    if (currentUrl.searchParams.get("lang") === urlLang) return;

    let stored = "en";
    try {
      stored = normalizeLang(localStorage.getItem("lang"));
    } catch {}

    const nextLang = currentUrl.searchParams.has("lang") ? urlLang : stored;

    if (currentUrl.searchParams.get("lang") === nextLang) return;

    currentUrl.searchParams.set("lang", nextLang);

    router.replace(
      `${currentUrl.pathname}?${currentUrl.searchParams.toString()}`,
      { scroll: false }
    );
  }, [router]);

  function setLang(nextLang) {
    if (typeof window === "undefined") return;

    const v = normalizeLang(nextLang);
    const currentUrl = new URL(window.location.href);

    currentUrl.searchParams.set("lang", v);

    try {
      localStorage.setItem("lang", v);
    } catch {}

    router.replace(
      `${currentUrl.pathname}?${currentUrl.searchParams.toString()}`,
      { scroll: false }
    );
  }

  const t = useMemo(() => translations[lang] || translations.en, [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

