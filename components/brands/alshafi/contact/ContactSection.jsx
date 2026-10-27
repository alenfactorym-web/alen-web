"use client";

import { useEffect, useState } from "react";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import styles from "./ContactSection.module.css";
import AlshafiSideIntro from "@/components/brands/alshafi/shared/AlshafiSideIntro";
import AlshafiSectionWatermark from "@/components/brands/alshafi/shared/AlshafiSectionWatermark";

export default function AlshafiContactSection({ lang = "en" }) {
  const safeLang = (lang || "en").toLowerCase();
  const isRTL = safeLang === "ar" || safeLang === "ku";

  const uiFont =
    safeLang === "ar" ? "font-ar-title" : safeLang === "ku" ? "ku-title" : "";

  const getBodyClass = () => {
    if (safeLang === "ar") return "font-ar-body";
    if (safeLang === "ku") return "ku-body";
    return "font-en-body";
  };

  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadContact() {
      try {
        const res = await fetch("/api/contact", { cache: "no-store" });
        const data = await res.json();

        if (!ignore && data?.item) {
          setContactData(data.item);
        }
      } catch {
        // fallback content
      }
    }

    loadContact();

    return () => {
      ignore = true;
    };
  }, []);

  const getLangValue = (field, fallback) => {
    if (!field) return fallback;

    if (safeLang === "ar") return field.ar || field.en || fallback;
    if (safeLang === "ku") return field.ku || field.en || fallback;

    return field.en || fallback;
  };

  const company = contactData?.company || "ALEN FACTORY";
  const email = contactData?.email || "info@alenfactory.com";
  const phones = contactData?.phones || ["+9647507263333", "+9647707263333"];

  const mapSrc =
    contactData?.mapSrc ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3255.488172826694!2d44.0283322!3d36.0793754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4007310062776865%3A0x4473f6431e4d319c!2sSwissrose%20Factory!5e0!3m2!1sen!2s!4v1708427349881";

  const mapLink =
    contactData?.mapLink ||
    "https://www.google.com/maps/place/Swissrose+Factory/@36.0793754,44.0283322,17z/";

  const waNumber = contactData?.whatsAppNumber || phones[0] || "";
  const waE164 = String(waNumber).replace(/[^\d]/g, "");
  const waLink = `https://wa.me/${waE164}`;

  const addressText = getLangValue(
    contactData?.address,
    safeLang === "ar"
      ? "العراق، أربيل، طريق كركوك"
      : safeLang === "ku"
      ? "عێراق، هەولێر، ڕێگای کەرکووک"
      : "Iraq, Erbil, Kirkuk Road"
  );

  const footerText = getLangValue(
    contactData?.footerText,
    safeLang === "ar"
      ? "نحن في عائلة آلين نجتذب أفضل الخبرات من مختلف البلدان ونستخدم أفضل المواد الخام في العالم لصناعة منتجاتنا، ويسعى موظفونا باستمرار لتقديم أعلى مستويات الجودة والإنتاج."
      : safeLang === "ku"
      ? "ئێمە لە خێزانی ئالین باشترین پسپۆڕان لە وڵاتانی جیاواز ڕادەکێشین و باشترین ماددەی سەرەتایی جیهان بەکاردەهێنین بۆ دروستکردنی بەرهەمەکانمان، ستافەکەمان بەردەوام هەوڵ دەدات بۆ گەیاندنی بەرزترین ئاستی کوالێتی و بەرهەمهێنان."
      : "We at Alen Family attract the best professionals from other countries and use the best raw materials in the world to make our products, our employees are constantly striving to provide the highest quality and production."
  );

  const sideCopy = {
    en: {
      eyebrow: "CONNECT",
      titleTop: "ALSHAFI",
      titleBottom: "CONTACT",
      desc: "Reach our team for product information, brand inquiries, and business communication.",
      f1: "FAST RESPONSE",
      f1d: "Our team is ready to help.",
      f2: "BRAND SUPPORT",
      f2d: "Direct communication for Alshafi.",
      location: "Our Location",
      whatsapp: "Contact Us",
    },
    ar: {
      eyebrow: "تواصل",
      titleTop: "الشافي",
      titleBottom: "اتصل بنا",
      desc: "تواصل مع فريقنا لمعلومات المنتجات والاستفسارات التجارية الخاصة بالعلامة.",
      f1: "استجابة سريعة",
      f1d: "فريقنا جاهز للمساعدة",
      f2: "دعم العلامة التجارية",
      f2d: "تواصل مباشر مع فريق الشافي",
      location: "الموقع",
      whatsapp: "تواصل معنا",
    },
    ku: {
      eyebrow: "پەیوەندی",
      titleTop: "ئەلشافی",
      titleBottom: "پەیوەندی",
      desc: "بۆ زانیاری بەرهەمەکان و پەیوەندی تایبەت بە براندەکەمان پەیوەندیمان پێوە بکە.",
      f1: "وەڵامی خێرا",
      f1d: "تیمی ئێمە ئامادەی یارمەتیدانە.",
      f2: "پشتیوانی براند",
      f2d: "پەیوەندی ڕاستەوخۆ بۆ ئەلشافی.",
      location: "شوێن",
      whatsapp: "پەیوەندیمان پێوە بکە",
    },
  };

  const t = sideCopy[safeLang] || sideCopy.en;

  return (
    <section id="contact" className={`${styles.section} ${uiFont}`}>
      <div className={styles.layout} dir="ltr">
  <AlshafiSectionWatermark
    type="contact"
    className="alshafi-contact-watermark"
  />

  <div className={styles.contentGrid}>
          <AlshafiSideIntro
            lang={safeLang}
            variant="contact"
            iconSrc=""
            eyebrow={t.eyebrow}
            titleTop={t.titleTop}
            titleBottom={t.titleBottom}
            desc={t.desc}
            features={[
              {
                title: t.f1,
                desc: t.f1d,
              },
              {
                title: t.f2,
                desc: t.f2d,
              },
            ]}
          />

          <div className={styles.mediaColumn}>
            <div className={styles.contactPanel} dir={isRTL ? "rtl" : "ltr"}>
              <div className={styles.mapCard}>
                <iframe
                  title="Alshafi Location"
                  src={mapSrc}
                  className={styles.mapFrame}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className={styles.infoPanel} dir={isRTL ? "rtl" : "ltr"}>
                <div className={styles.addressBlock}>
                  <p
                    className={`${styles.infoLabel} ${styles.latinText} font-en-body`}
                  >
                    {company}
                  </p>

                  <div className={`${styles.addressLine} ${getBodyClass()}`}>
                    <MapPin size={20} />
                    <p>{addressText}</p>
                  </div>
                </div>

                <div className={styles.contactRows} dir="ltr">
                  <a href={`mailto:${email}`} className="font-en-body">
                    <Mail size={18} />
                    <span className={styles.latinText}>{email}</span>
                  </a>

                  {phones.map((p) => (
                    <a key={p} href={`tel:${p}`} className="font-en-body">
                      <Phone size={18} />
                      <span className={styles.latinText}>{p}</span>
                    </a>
                  ))}
                </div>

                <div className={styles.actionsRow}>
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.actionButton}
                  >
                    <MapPin size={17} />
                    <span>{t.location}</span>
                  </a>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.actionButton}
                  >
                    <MessageCircle size={17} />
                    <span>{t.whatsapp}</span>
                  </a>
                </div>
              </div>

              <div
                className={`${styles.footerText} ${getBodyClass()}`}
                dir={isRTL ? "rtl" : "ltr"}
                data-lang={safeLang}
              >
                <p>{footerText}</p>
              </div>
            </div>
          </div>
               </div>
      </div>

      <div className={styles.signatureBar}>
        <span className={styles.copyright}>
          © 2026 ALSHAFI. All rights reserved.
        </span>

        <a
          href="https://wa.me/989144401036"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Designed and developed by Black Cube"
          className={styles.blackCubeSignature}
        >
          <span className={styles.signatureText}>
            Designed &amp; Developed by
          </span>

          <img
            src="/branding/black-cube-logo-white.png"
            alt="Black Cube Visual Design Studio"
            className={styles.signatureLogo}
            draggable="false"
          />
        </a>
      </div>
    </section>
  );
}
