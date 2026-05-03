"use client";

import SiteHeaderV1 from "@/components/locked/SiteHeader.v1";
import SocialBarV1 from "@/components/locked/SocialBar.v1";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function SiteChrome() {
  const { lang, setLang, t } = useLanguage();

  return (
    <>
      <SiteHeaderV1 lang={lang} setLang={setLang} t={t} />
      <SocialBarV1 />
    </>
  );
}

