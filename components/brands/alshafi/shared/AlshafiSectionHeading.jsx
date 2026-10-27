"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

function AnimatedLetters({ text }) {
  return (    <span className="alshafi-letter-wave">
      {String(text).split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="alshafi-letter"
          style={{ animationDelay: `${i * 0.09}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export default function AlshafiSectionHeading({
  autoFitMobile = false,
  bottomTitle = "SECTION",  desc = "",
  featureOne = "",
  featureOneDesc = "",
  featureTwo = "",
  featureTwoDesc = "",
  className = "",
  imageSrc = "",

  eyebrow = "EXPLORE",
  titleTop = "ALSHAFI",
  animateLetters = true,
  lang = "en",
}) {
  const safeLang = (lang || "en").toLowerCase();
  const isRTL = safeLang === "ar" || safeLang === "ku";
    const fontClass =
    safeLang === "ar" ? "font-ar-title" : safeLang === "ku" ? "ku-title" : "";

  const titleRef = useRef(null);
  const [fitSize, setFitSize] = useState(52);

  useLayoutEffect(() => {
    if (!autoFitMobile) return;

    let cancelled = false;

    function fitTitle() {
      if (cancelled || !titleRef.current) return;

      const mobile = window.matchMedia(
        "(max-width: 600px) and (orientation: portrait)"
      ).matches;

      if (!mobile) {
        setFitSize(52);
        return;
      }

      const title = titleRef.current;
      const BASE = 52;
      const available = Math.max(
        1,
        Math.min(title.clientWidth, window.innerWidth - 48)
      );

      const probe = title.cloneNode(true);
probe.querySelectorAll(".alshafi-letter").forEach((letter) => {
  letter.style.animation = "none";
});

      probe.style.setProperty("position", "absolute", "important");
      probe.style.setProperty("visibility", "hidden", "important");
      probe.style.setProperty("width", "max-content", "important");
      probe.style.setProperty("max-width", "none", "important");
      probe.style.setProperty("white-space", "nowrap", "important");
      probe.style.setProperty("font-size", `${BASE}px`, "important");
      probe.style.setProperty("animation", "none", "important");
      probe.style.setProperty("pointer-events", "none", "important");

      document.body.appendChild(probe);

      const needed = probe.getBoundingClientRect().width;

      probe.remove();

      if (!needed) return;

      const next = Math.min(BASE, (BASE * available) / needed);

      setFitSize(Math.floor(next * 100) / 100);
    }

    fitTitle();

    window.addEventListener("resize", fitTitle);
    document.fonts?.ready?.then(fitTitle);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", fitTitle);
    };
  }, [autoFitMobile, titleTop, safeLang]);

  return (
    <aside
      dir={isRTL ? "rtl" : "ltr"}
      className={`relative z-10 mx-auto w-full max-w-[320px] shrink-0 text-center lg:mx-0 lg:w-[300px] lg:pt-10 ${fontClass} ${className}`}
    >

      {imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          width={420}
          height={420}
          className="alshafi-heading-vector pointer-events-none absolute left-1/2 top-[300px] -z-10 -translate-x-1/2 opacity-[0.13] scale-[1.05] lg:left-[5px] lg:top-[360px] lg:translate-x-0 lg:opacity-[0.2] lg:scale-[1.2]"
        />
      ) : null}

      <p className="text-xs font-bold tracking-[0.35em] text-[#c99a3a] sm:text-sm">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-center text-5xl font-light leading-[0.72] text-[#111] sm:text-5xl">
        <span
  ref={titleRef}
  className="alshafi-section-top-title block text-center text-5xl font-bold sm:text-6xl"
  data-auto-fit-mobile={autoFitMobile ? "true" : undefined}
  style={
    autoFitMobile
      ? { "--alshafi-fit-size": `${fitSize}px` }
      : undefined
  }
>
          {animateLetters ? (
  <AnimatedLetters text={titleTop} />
) : (
  titleTop
)}
        </span>

        <br />

        <span className="alshafi-section-bottom-title text-[#c99a3a]">
         {animateLetters ? (
  <AnimatedLetters text={bottomTitle} />
) : (
  bottomTitle
)}
        </span>
      </h2>

      <div className="alshafi-heading-line mx-auto mt-6 h-px w-[260px] bg-[#c99a3a]/80 sm:w-[340px]" />

      {desc ? (
        <p className="alshafi-section-desc mx-auto mt-6 max-w-[320px] text-center text-base leading-8 text-[#444] sm:text-lg sm:leading-6">
          {desc}
        </p>
      ) : null}

      {(featureOne || featureTwo) ? (
      <div className="alshafi-heading-features mx-auto mt-120 hidden max-w-[220px] space-y-6 text-center lg:block">
          {featureOne ? (
            <div>
              <h3 className="text-[14px] font-bold text-center text-[#c99a3a]">
                {featureOne}
              </h3>

              {featureOneDesc ? (
                <p className="mt-1 text-[13px] leading-5 text-[#555]">
                  {featureOneDesc}
                </p>
              ) : null}
            </div>
          ) : null}

          {featureTwo ? (
            <div>
              <h3 className="text-[14px] font-bold text-center text-[#c99a3a]">
                {featureTwo}
              </h3>

              {featureTwoDesc ? (
                <p className="mt-1 text-[13px] leading-5 text-[#555]">
                  {featureTwoDesc}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}