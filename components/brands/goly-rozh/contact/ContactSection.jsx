"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";

import GolyRozhReveal from "../shared/GolyRozhReveal";
import GolyRozhSectionHeading from "../shared/GolyRozhSectionHeading";

import styles from "./ContactSection.module.css";


const COPY = {
  en: {
    eyebrow: "GET IN TOUCH",
    titleTop: "GOLY ROZH",
    titleBottom: "CONTACT",
    desc:
      "Connect with our team for product, distribution, and business inquiries.",

    location: "OUR LOCATION",
    whatsapp: "CONTACT US",
  },

  ar: {
    eyebrow: "تواصل معنا",
    titleTop: "GOLY ROZH",
    titleBottom: "اتصل بنا",
    desc:
      "تواصل مع فريقنا للاستفسارات المتعلقة بالمنتجات والتوزيع والأعمال.",

    location: "موقعنا",
    whatsapp: "تواصل معنا",
  },

  ku: {
    eyebrow: "پەیوەندی",
    titleTop: "گولی ڕۆژ",
    titleBottom: "پەیوەندی",
    desc:
      "بۆ پرسیار لەبارەی بەرهەم و دابەشکردن و کاروبار پەیوەندیمان پێوە بکە.",

    location: "شوێنی ئێمە",
    whatsapp: "پەیوەندیمان پێوە بکە",
  },
};

function pickLang(value, lang, fallback = "") {
  if (!value) return fallback;

  if (typeof value === "string") {
    return value;
  }

  if (lang === "ar") {
    return value.ar || value.en || fallback;
  }

  if (lang === "ku") {
    return value.ku || value.en || fallback;
  }

  return value.en || fallback;
}


function getWhatsAppLink(number) {
  const digits =
    String(number || "").replace(/[^\d]/g, "");

  if (!digits) return "#";

  if (digits.startsWith("964")) {
    return `https://wa.me/${digits}`;
  }

  if (digits.startsWith("0")) {
    return `https://wa.me/964${digits.slice(1)}`;
  }

  return `https://wa.me/${digits}`;
}


function ContactCurve() {
  return (
    <div
      className={styles.curve}
      aria-hidden="true"
    >
      <svg
        className={`${styles.curveSvg} ${styles.curveSvgLandscape}`}
        viewBox="0 0 1600 180"
        preserveAspectRatio="none"
      >
        <path
          className={styles.curveFill}
          fill="currentColor"
          d="
            M0 0
            C240 0, 430 0, 560 6
            C670 11, 745 40, 800 150
            C855 40, 930 11, 1040 6
            C1170 0, 1360 0, 1600 0
            L1600 0
            L0 0
            Z
          "
        />

        <path
          className={styles.curveStroke}
          fill="none"
          stroke="#c7c7c7"
          strokeWidth="10"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          d="
            M0 0
            C240 0, 430 0, 560 6
            C670 11, 745 40, 800 150
            C855 40, 930 11, 1040 6
            C1170 0, 1360 0, 1600 0
          "
        />
      </svg>

      <svg
        className={`${styles.curveSvg} ${styles.curveSvgPortrait}`}
        viewBox="0 0 1000 180"
        preserveAspectRatio="none"
      >
        <path
          className={styles.curveFill}
          fill="currentColor"
          d="
            M0 0
            C90 0, 140 0, 190 2
            C340 4, 420 30, 500 138
            C580 30, 660 4, 810 2
            C860 0, 910 0, 1000 0
            L1000 0
            L0 0
            Z
          "
        />

        <path
          className={styles.curveStroke}
          fill="none"
          stroke="#c7c7c7"
          strokeWidth="10"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          d="
            M0 0
            C90 0, 140 0, 190 2
            C340 4, 420 30, 500 138
            C580 30, 660 4, 810 2
            C860 0, 910 0, 1000 0
          "
        />
      </svg>
    </div>
  );
}


export default function GolyRozhContactSection() {
  const { lang } = useLanguage();

  const currentLang =
    ["en", "ar", "ku"].includes(lang)
      ? lang
      : "en";

  const copy = COPY[currentLang];

  const isRTL =
    currentLang === "ar" ||
    currentLang === "ku";

  const titleFont =
    currentLang === "ar"
      ? "font-ar-title"
      : currentLang === "ku"
        ? "ku-title"
        : "";

  const bodyFont =
    currentLang === "ar"
      ? "font-ar-body"
      : currentLang === "ku"
        ? "ku-body"
        : "font-en-body";


  const [contactData, setContactData] =
    useState(null);


  useEffect(() => {
    let ignore = false;

    async function loadContact() {
      try {
        const response =
          await fetch(
            "/api/contact",
            {
              cache: "no-store",
            },
          );

        const data =
          await response.json();

        if (!ignore && data?.item) {
          setContactData(data.item);
        }
      } catch {
        /* keep fallback data */
      }
    }

    loadContact();

    return () => {
      ignore = true;
    };
  }, []);


  const company =
    contactData?.company ||
    "ALEN FACTORY";

  const email =
    contactData?.email ||
    "info@alenfactory.com";

  const phones =
    Array.isArray(contactData?.phones) &&
    contactData.phones.length > 0
      ? contactData.phones
      : [
          "+9647507263333",
          "+9647707263333",
        ];


  const addressText =
    pickLang(
      contactData?.address,
      currentLang,
      currentLang === "ar"
        ? "العراق، أربيل، طريق كركوك"
        : currentLang === "ku"
          ? "عێراق، هەولێر، ڕێگای کەرکووک"
          : "Iraq, Erbil, Kirkuk Road",
    );


  const footerText =
    pickLang(
      contactData?.footerText,
      currentLang,
      "",
    );


  const mapSrc =
    contactData?.mapSrc ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3255.488172826694!2d44.0283322!3d36.0793754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4007310062776865%3A0x4473f6431e4d319c!2sSwissrose%20Factory!5e0!3m2!1sen!2s!4v1708427349881";


  const mapLink =
    contactData?.mapLink ||
    "https://www.google.com/maps/place/Swissrose+Factory/@36.0793754,44.0283322,17z/";


  const whatsappNumber =
    contactData?.whatsAppNumber ||
    phones[0] ||
    "";

  const whatsappLink =
    getWhatsAppLink(
      whatsappNumber,
    );


  return (
    <section
      id="contact"
      className={
        styles.contactSection
      }
      dir={isRTL ? "rtl" : "ltr"}
      data-lang={currentLang}
    >
      <ContactCurve />

      <div
        className={styles.redGlow}
        aria-hidden="true"
      />

      <div className={styles.inner}>
        <GolyRozhReveal
          key={currentLang}
          className={
            styles.headingWrap
          }
          replayKey={currentLang}
        >
          <GolyRozhSectionHeading
            eyebrow={copy.eyebrow}
            titleTop={copy.titleTop}
            titleBottom={
              copy.titleBottom
            }
            desc={copy.desc}
            lang={currentLang}
            className={styles.heading}
          />
        </GolyRozhReveal>


        <div
          className={`${styles.themeCard} ${styles.mapCard}`}
        >
          <div
            className={
              styles.mapFrame
            }
          >
            <iframe
              title="Goly Rozh Map"
              src={mapSrc}
              className={
                styles.mapIframe
              }
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div
              className={
                styles.mapShade
              }
            />
          </div>
        </div>


        <div
          className={`${styles.themeCard} ${styles.infoCard}`}
        >
          <div
            className={
              styles.addressBlock
            }
          >
            <p
              className={`${styles.company} font-en-body`}
              dir="ltr"
            >
              {company}
            </p>

            <div
              className={`${styles.addressRow} ${bodyFont}`}
            >
              <MapPin
                className={
                  styles.infoIcon
                }
                aria-hidden="true"
              />

              <p>{addressText}</p>
            </div>
          </div>


          <div
            className={
              styles.divider
            }
          />


          <div
            className={
              styles.infoBottom
            }
          >
            <div
              className={
                styles.contactRows
              }
              dir="ltr"
            >
              <a
                href={`mailto:${email}`}
                className="font-en-body"
              >
                <Mail
                  className={
                    styles.infoIcon
                  }
                  aria-hidden="true"
                />

                <span>{email}</span>
              </a>

              {phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone}`}
                  className="font-en-body"
                >
                  <Phone
                    className={
                      styles.infoIcon
                    }
                    aria-hidden="true"
                  />

                  <span>
                    {phone}
                  </span>
                </a>
              ))}
            </div>


            <div
              className={
                styles.actions
              }
            >
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className={`${styles.actionButton} ${titleFont}`}
              >
                <MapPin
                  aria-hidden="true"
                />

                <span>
                  {copy.location}
                </span>
              </a>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className={`${styles.actionButton} ${titleFont}`}
              >
                <MessageCircle
                  aria-hidden="true"
                />

                <span>
                  {copy.whatsapp}
                </span>
              </a>
            </div>
          </div>
        </div>


        {footerText ? (
          <div
            className={`${styles.footerText} ${bodyFont}`}
          >
            <p>{footerText}</p>
          </div>
        ) : null}
      </div>
<div className={styles.signatureBar}>
  <span className={styles.signatureCopyright}>
    © 2026 ALEN Factory. All rights reserved.
  </span>

  <a
    href="https://wa.me/989144401036"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Designed and developed by Black Cube"
    className={styles.signatureLink}
  >
    <span>Designed &amp; Developed by</span>

    <img
  src="/branding/black-cube-logo.png"
  alt="Black Cube Visual Design Studio"
  className={styles.signatureLogo}
  draggable="false"
/>
  </a>
</div>
    </section>
  );
}