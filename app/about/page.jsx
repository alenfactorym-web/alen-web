"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { SiteHeader } from "@/components/locked";
import SocialBarV1 from "@/components/locked/SocialBar.v1";
import AboutSectionV1 from "@/components/locked/AboutSection.v1";

export default function AboutPage() {
  const { lang, setLang, t } = useLanguage();

  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} setLang={setLang} t={t} />
      <SocialBarV1 />
      <AboutSectionV1 lang={lang} />
    </main>
  );
}

