"use client";

import Link from "next/link";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import SectionHeader from "@/components/products/SectionHeader";
import { MotionTitle, MotionSubtitle } from "@/components/ui/MotionText";

export default function ContactSectionV1({ lang = "en" }) {
  const safeLang = (lang || "en").toLowerCase();
  const uiFont = safeLang === "ar" ? "font-ar-title" : safeLang === "ku" ? "ku-title" : "";
  const isRTL = safeLang === "ar" || safeLang === "ku";
  const [contactData, setContactData] = useState(null);

  // ✅ ریست موشن‌ها روی تغییر زبان
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    setResetKey((k) => k + 1);
  }, [safeLang]);
  useEffect(() => {
    let ignore = false;

    async function loadContact() {
      try {
        const res = await fetch("/api/contact", { cache: "no-store" });
        const data = await res.json();

        if (!ignore && data?.item) {
          setContactData(data.item);
        }
      } catch {}
    }

    loadContact();

    return () => {
      ignore = true;
    };
  }, []);
  // ✅ EN chars | AR/KU block
  const revealMode = safeLang === "en" ? "chars" : "block";

  // ✅ تایم مثل بقیه سکشن‌ها
  const titleStagger = safeLang === "en" ? 0.085 : 0;
  const subStagger = safeLang === "en" ? 0.045 : 0;

  const getBodyClass = () => {
    if (safeLang === "ar") return "font-ar-body";
    if (safeLang === "ku") return "ku-body";
    return "font-en-body";
  };

  /* ===================== TEXTS ===================== */
  const title =
    (contactData?.title &&
      (safeLang === "ar"
        ? contactData.title.ar || contactData.title.en
        : safeLang === "ku"
        ? contactData.title.ku || contactData.title.en
        : contactData.title.en)) ||
    (safeLang === "ar" ? "اتصل بنا" : safeLang === "ku" ? "پەیوەندی" : "Contact Us");

   const subtitle =
    (contactData?.subtitle &&
      (safeLang === "ar"
        ? contactData.subtitle.ar || contactData.subtitle.en
        : safeLang === "ku"
        ? contactData.subtitle.ku || contactData.subtitle.en
        : contactData.subtitle.en)) ||
    (safeLang === "ar"
      ? "معلومات الاتصال"
      : safeLang === "ku"
      ? "زانیاری پەیوەندی"
      : "Contact Information");

   const addressText =
    (contactData?.address &&
      (safeLang === "ar"
        ? contactData.address.ar || contactData.address.en
        : safeLang === "ku"
        ? contactData.address.ku || contactData.address.en
        : contactData.address.en)) ||
    (safeLang === "ar"
      ? "العراق، أربيل، طريق كركوك"
      : safeLang === "ku"
      ? "عێراق، هەولێر، ڕێگای کەرکووک"
      : "Iraq, Erbil, Kirkuk Road");

    const footerText =
    (contactData?.footerText &&
      (safeLang === "ar"
        ? contactData.footerText.ar || contactData.footerText.en
        : safeLang === "ku"
        ? contactData.footerText.ku || contactData.footerText.en
        : contactData.footerText.en)) ||
    (safeLang === "ar"
      ? "نحن في عائلة آلين نجتذب أفضل الخبرات من مختلف البلدان ونستخدم أفضل المواد الخام في العالم لصناعة منتجاتنا، ويسعى موظفونا باستمرار لتقديم أعلى مستويات الجودة والإنتاج."
      : safeLang === "ku"
      ? "ئێمە لە خێزانی ئالین باشترین پسپۆڕان لە وڵاتانی جیاواز ڕادەکێشین و باشترین ماددەی سەرەتایی جیهان بەکاردەهێنین بۆ دروستکردنی بەرهەمەکانمان، ستافەکەمان بەردەوام هەوڵ دەدات بۆ گەیاندنی بەرزترین ئاستی کوالێتی و بەرهەمهێنان."
      : "We at Alen Family attract the best professionals from other countries and use the best raw materials in the world to make our products, our employees are constantly striving to provide the highest quality and production.");
  /* ===================== DATA ===================== */
   const company = contactData?.company || "Alen Factory";
  const email = contactData?.email || "info@alenfactory.com";
  const phones = contactData?.phones || ["07507263333", "07707263333"];

    const mapSrc =
    contactData?.mapSrc ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3255.488172826694!2d44.0283322!3d36.0793754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4007310062776865%3A0x4473f6431e4d319c!2sSwissrose%20Factory!5e0!3m2!1sen!2s!4v1708427349881";

  const mapLink =
    contactData?.mapLink ||
    "https://www.google.com/maps/place/Swissrose+Factory/@36.0793754,44.0283322,17z/";

  const waNumber = contactData?.whatsAppNumber || phones[0];

const waDigits = String(waNumber || "").replace(/\D/g, "");

const waE164 = waDigits.startsWith("964")
  ? waDigits
  : waDigits.startsWith("0")
    ? `964${waDigits.slice(1)}`
    : `964${waDigits}`;

const waLink = `https://wa.me/${waE164}?text=${encodeURIComponent(
  "Hello ALEN Factory"
)}`;

  /* ===================== UI ===================== */
  function ThemeCard({ children, className = "", noHover = false }) {
    return (
      <div
        className={[
          "relative overflow-hidden rounded-3xl",
          "bg-white/95 backdrop-blur-xl border border-black/10",
          "shadow-[0_22px_45px_-30px_rgba(0,0,0,0.7)]",
          "border-b-[8px] border-b-yellow-400",
          noHover ? "" : "group transition hover:shadow-[0_35px_70px_-45px_rgba(0,0,0,0.85)]",
          className,
        ].join(" ")}
      >
        {!noHover && (
          <span
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
            bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.7)_35%,transparent_70%)]
            bg-[length:200%_100%] transition-all duration-700"
          />
        )}
        {children}
      </div>
    );
  }

  function ActionButton({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
     className="
  w-[180px] sm:w-[190px] md:w-[200px] 2xl:w-[220px]
  inline-flex items-center justify-center gap-2
  rounded-full
  border border-yellow-400/40
  bg-yellow-400/90 text-zinc-800
  px-4 py-2.5 text-[12px] font-black
  transition
  hover:bg-yellow-500 hover:text-black
  active:scale-95
  whitespace-nowrap
"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </a>
  );
}

  const reset = `contact-${safeLang}-${resetKey}`;

  return (
    <section
      id="contact"
      className={`relative py-24 min-h-screen bg-transparent overflow-hidden isolate ${uiFont}`}
    >
            

<div
  className="w-[min(1500px,96vw)] mx-auto px-[clamp(16px,3vw,56px)] mb-24 mt-16 relative z-10"
  dir={isRTL ? "rtl" : "ltr"}
>        {/* ✅ Header با موشن + کمان (از SectionHeader) */}
        <SectionHeader
          resetKey={reset}
          title={
            <MotionTitle
              as="span"
              className="inline-block text-3xl md:text-4xl lg:text-5xl font-black text-zinc-500"
              reveal={revealMode}
              effect="mask"
              stagger={lang === "en" ? 0.045 : 0}
              delay={0.03}
              y={20}
              blur={8}
              amount={0.85}
              once={false}
              duration={0.95}
              resetKey={`contact-title-${reset}`}
            >
              {title}
            </MotionTitle>
          }
          subtitle={
            <MotionSubtitle
              as="span"
              className="inline-block text-base md:text-lg"
              reveal={revealMode}
              effect="mask"
              stagger={0.04}
      delay={0.03}
      y={16}
      blur={6}
      amount={0.85}
      once={false}
      duration={0.2}
              resetKey={`contact-sub-${reset}`}
            >
              {subtitle}
            </MotionSubtitle>
          }
        />

        {/* Map */}
        <ThemeCard className="alen-contact-map max-w-[1100px] 2xl:max-w-[1400px] mx-auto">
          <div className="relative h-[280px] md:h-[340px] lg:h-[380px] 2xl:h-[420px] bg-zinc-200 overflow-hidden">
            <iframe
              title="Alen Factory Map"
              src={mapSrc}
              className="absolute inset-0 w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/15" />
          </div>
        </ThemeCard>

        {/* Info */}
       <div className="alen-contact-info mt-6 max-w-[1100px] 2xl:max-w-[1400px] mx-auto">
  <ThemeCard className="p-6 md:p-7 2xl:p-9" noHover>
            <div className="flex flex-col gap-6">
              {/* Address */}
              <div>
                <div className="text-sm font-black text-zinc-500">{company}</div>
                <div className="mt-2 flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-yellow-500 shrink-0" />
                  <div className={`${getBodyClass()} text-zinc-500 text-base md:text-lg leading-relaxed`}>
                    {addressText}
                  </div>
                </div>
              </div>

              <div className="h-px bg-black/10" />

              {/* Email + Phones + Buttons */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                {/* ✅ ایمیل/شماره همیشه LTR + بدون font-sans */}
                <div className="flex flex-col gap-3" dir="ltr">
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-zinc-500 font-bold font-en-body hover:underline"
                  >
                    <Mail className="h-5 w-5 text-yellow-500 shrink-0" />
                    {email}
                  </a>

                  {phones.map((p) => (
                    <a
                      key={p}
                      href={`tel:${p}`}
                      className="flex items-center gap-3 text-zinc-500 font-bold font-en-body hover:underline"
                    >
                      <Phone className="h-5 w-5 text-yellow-500 shrink-0" />
                      {p}
                    </a>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                  <ActionButton
                    href={mapLink}
                    icon={MapPin}
                    label={safeLang === "ar" ? "الموقع" : safeLang === "ku" ? "شوێن" : "Our Location"}
                  />
                  <ActionButton
                    href={waLink}
                    icon={MessageCircle}
                    label={
                      safeLang === "ar"
                        ? "تواصل معنا"
                        : safeLang === "ku"
                        ? "پەیوەندیمان پێوە بکە"
                        : "Contact Us"
                    }
                  />
                </div>
              </div>
            </div>
          </ThemeCard>
        </div>

        {/* Footer text */}
        <div
    className={`alen-contact-text mt-10 max-w-[1100px] 2xl:max-w-[1400px] mx-auto  px-2 lg:px-0 news-body prose prose-lg text-zinc-600 ${getBodyClass()}`}
  dir={isRTL ? "rtl" : "ltr"}
>
          <p>{footerText}</p>
        </div>

        {/* Back */}
        <div className={`alen-contact-back mt-10 max-w-[1100px] 2xl:max-w-[1400px] mx-auto px-2 lg:px-0 flex items-center ${uiFont}`}>
          <Link
            href={`/?lang=${safeLang}`}
            className="rounded-full border bg-white/90 px-6 py-3 text-sm font-bold text-zinc-600 hover:bg-white shadow-sm transition-transform active:scale-95"
          >
            {safeLang === "ar" ? "رجوع" : safeLang === "ku" ? "گەڕانەوە" : "Back"}
          </Link>
        </div>

        <div className="h-2" />
      </div>
    </section>
  );
}

