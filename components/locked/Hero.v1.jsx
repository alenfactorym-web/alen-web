"use client";

import SpiceOverlayHover from "@/components/SpiceOverlayHover";
import { MotionTitle, MotionSubtitle } from "@/components/ui/MotionText";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
export default function Hero({ t, lang }) {
  const isArabic = lang === "ar";
  const isKurdish = lang === "ku";
  const titleFont = isArabic ? "font-ar-title" : isKurdish ? "ku-title" : "alen-title";
  const uiFont = isArabic ? "font-ar-title" : isKurdish ? "ku-title" : "";
  const revealMode = lang === "en" ? "chars" : "block";
  const [heroMedia, setHeroMedia] = useState(null);
  
   

  // ALEN Cinematic Scroll — Large Monitor & Laptop
  const heroRef = useRef(null);
  const [isLargeMonitor, setIsLargeMonitor] = useState(false);
  const [isLaptop, setIsLaptop] = useState(false);

  useEffect(() => {
    const large = window.matchMedia(
      "(min-width: 1280px) and (min-height: 900px) and (orientation: landscape)"
    );

    const laptop = window.matchMedia(
      "(min-width: 1367px) and (max-width: 1536px) and (max-height: 899px) and (orientation: landscape)"
    );

    const update = () => {
      setIsLargeMonitor(large.matches);
      setIsLaptop(laptop.matches);
    };

    update();

    large.addEventListener("change", update);
    laptop.addEventListener("change", update);

    return () => {
      large.removeEventListener("change", update);
      laptop.removeEventListener("change", update);
    };
  }, []);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const factoryScale = useTransform(
  scrollYProgress,
  [0, 0.95],
  [1, 1.28],
  { clamp: true }
);

const factoryY = useTransform(
  scrollYProgress,
  [0, 0.95],
  [0, -100],
  { clamp: true }
);

  const heroTextY = useTransform(
  scrollYProgress,
  [0, 0.90],
  [0, -160],
  { clamp: true }
);

const heroTextOpacity = useTransform(
  scrollYProgress,
  [0, 0.20, 0.80],
  [1, 1, 0],
  { clamp: true }
);
    const spiceOpacity = useTransform(
  scrollYProgress,
  [0, 0.18, 0.75],
  [1, 1, 0]
);

const laptopFactoryScale = useTransform(
  scrollYProgress,
  [0, 0.95],
  [1, 1.12]
);

const laptopFactoryY = useTransform(
  scrollYProgress,
  [0, 0.95],
  [0, -35]
);

const laptopTextOpacity = useTransform(
  scrollYProgress,
  [0, 0.25, 0.75],
  [1, 1, 0]
);

const laptopSpiceOpacity = useTransform(
  scrollYProgress,
  [0, 0.20, 0.70],
  [1, 1, 0]
);   
       useEffect(() => {
    let ignore = false;
    async function loadHeroMedia() {
      try {
        const res = await fetch("/api/hero-media", { cache: "no-store" });
        const data = await res.json();
        if (!ignore && data?.item) {
          setHeroMedia(data.item);
        }
      } catch {}
    }
    loadHeroMedia();
    return () => { ignore = true; };
  }, []);

  const heroOverlayImage = heroMedia?.heroImage || "";
  const heroOverlayVideo = heroMedia?.heroVideo || "";

  function goBrands() {
  if (typeof window === "undefined") return;
  const el = document.getElementById("brands");
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

 return (
  <motion.section
    ref={heroRef}
    initial={{ opacity: 0, scale: 1.02 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.2 }}
    className="h-screen relative overflow-hidden text-white"
  >
      <div className="absolute inset-0 bg-black" />

      {/* Factory Cinematic Depth Layer */}
      <motion.div
        className="absolute inset-0"
        style={{
  scale: isLargeMonitor
    ? factoryScale
    : isLaptop
      ? laptopFactoryScale
      : 1,

  y: isLargeMonitor
    ? factoryY
    : isLaptop
      ? laptopFactoryY
      : 0,

  transformOrigin: "center center",
}}
      >
        <picture className="absolute inset-0 w-full h-full">
          <source
            media="(orientation: portrait) and (max-width: 1023px)"
            srcSet="/hero-square.webp"
          />

          <source
            media="(orientation: landscape)"
            srcSet="/hero-rect.webp"
          />

          <img
            src="/hero-rect.webp"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-100 brightness-100 contrast-110"
            alt="Factory Background"
            draggable="false"
          />
        </picture>
      </motion.div>
      {/* بخش ویدئو - دقیقاً طبق استایل و اندازه خودت */}
      <motion.div
  className="
    hidden
    [@media(hover:hover)_and_(pointer:fine)]:block
    [@media(min-width:768px)_and_(max-width:1023px)_and_(orientation:portrait)]:block
    [@media(max-width:767px)_and_(orientation:portrait)]:block

    absolute left-1/2 -translate-x-1/2 top-[3%]
    w-[min(1400px,96vw)] h-[520px] z-50

    hero-spice-video
  "
  style={{
    opacity: isLargeMonitor
      ? spiceOpacity
      : isLaptop
        ? laptopSpiceOpacity
        : 1,
  }}
>
        {heroOverlayImage && heroOverlayVideo ? (
          <SpiceOverlayHover
            imgSrc={heroOverlayImage}
            videoSrc={heroOverlayVideo}
          />
        ) : null}
      </motion.div>

      <div className="absolute inset-0 bg-black/15 pointer-events-none z-10" />
      <div className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-6 pt-0 lg:pt-24 hero-stack">
       {heroOverlayImage ? (
  <img
    src={heroOverlayImage}
    alt="Spices"
    draggable={false}
    className="hidden pointer-events-none hero-spice"
  />
) : null}

        <motion.div
   className="hero-text-block"
  style={{
    y: isLargeMonitor ? heroTextY : 0,
    opacity: isLargeMonitor
      ? heroTextOpacity
      : isLaptop
        ? laptopTextOpacity
        : 1,
  }}
>
  <MotionTitle
            as="h1"
            className={`hero-title text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-2 tracking-tight ${titleFont}`}
            reveal={revealMode}
            effect="mask"
            stagger={lang === "en" ? 0.045 : 0}
            delay={0.03}
            y={20}
            blur={8}
            amount={0.85}
            once={false}
            duration={0.95}
            resetKey={`hero-title-${lang}`}
          >
            {t?.heroTitle || "ALEN FACTORY"}
          </MotionTitle>

          <MotionSubtitle
            as="p"
            className={`hero-sub font-medium mb-8 opacity-90 ${uiFont} ${
  lang === "en"
    ? "text-2xl md:text-3xl lg:text-4xl"
    : "text-xl md:text-2xl lg:text-3xl"
}`}
            reveal={revealMode}
            effect="mask"
            stagger={0.04}
            delay={0.03}
            y={16}
            blur={6}
            amount={0.85}
            once={false}
            duration={0.2}
            resetKey={`hero-sub-${lang}`}
          >
            {t?.heroSub || ""}
          </MotionSubtitle>

         <motion.button
  type="button"
  onClick={goBrands}
  whileHover={{ scale: 1.08 }}
  whileTap={{ scale: 0.94 }}
  transition={{ duration: 0.2 }}
  className={`hero-cta bg-yellow-400 hover:bg-yellow-500 text-black font-black py-2 px-5 text-sm
    rounded-full shadow-2xl ${uiFont}`}
>
            {t?.explore || "Explore Brands"}
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}

