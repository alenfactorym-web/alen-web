
export default function AlshafiHero({ brand, lang }) {
  const currentLang = ["en", "ar", "ku"].includes(lang) ? lang : "en";
  const isRtl = currentLang === "ar" || currentLang === "ku";
  const langFont =
  currentLang === "ar" ? "font-ar-title" : currentLang === "ku" ? "ku-title" : "";

const brandFont = currentLang === "en" ? "font-alshafi-logo" : langFont;
const brandSize =  currentLang === "en"
  ? "text-[48px] sm:text-[68px] md:text-[88px] lg:text-[92px] xl:text-[122px]"
  : "text-[34px] sm:text-[50px] md:text-[72px] lg:text-[76px] xl:text-[94px]";
const brandTextFix = currentLang === "en" ? "" : "leading-[1.45] pb-2";
  const copy = {
    en: {
      badge: "PREMIUM QUALITY",
      brand: "ALSHAFI",
      spices: "SPICES",
      crafted: "SUITABLE FOR ALL TASTES",
      desc: "Natural flavors crafted for everyone. Carefully selected, perfectly blended.",
     products: "Explore Products",
        learn: "Learn More", 
    },
    ar: {
      badge: "جودة فاخرة",
      brand: "الشافي",
      spices: "بهارات",
      crafted: "مناسب لجميع الأذواق",
      desc: "نكهات طبيعية مختارة بعناية وممزوجة بإتقان.",
      products: "عرض المنتجات",
      learn: "اعرف المزيد",
    },
    ku: {
      badge: "کوالێتی بەرز",
      brand: "الشافی",
      spices: "بەهارات",
      crafted: " بۆ هەموو تام و چێژێک دەبێت",
      desc: "تامی سروشتی بە وردی هەڵبژێردراو و بە باشی تێکەڵکراو.",
      products: "بینینی بەرهەمەکان",
      learn: "زیاتر بزانە",
    },
  }[currentLang];

 return (
<section className="relative min-h-screen overflow-visible flex items-center">
<span data-alshafi-leaf data-speed="0.1" className="alshafi-leaf-1 group/leaf1 pointer-events-auto absolute right-[5vw] bottom-[28vh] z-[2] block w-[130px]">
  <img
    src="/lieaf-vector-001.webp"
    className="pointer-events-none w-full origin-center opacity-85 blur-[0.5px] will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/leaf1:translate-x-[14px] group-hover/leaf1:-translate-y-[10px] group-hover/leaf1:rotate-[12deg] group-hover/leaf1:scale-[1.15]"
  />

  <span className="pointer-events-none absolute left-1/2 bottom-[-6px] h-[12px] w-[60%] -translate-x-1/2 rounded-full bg-black/40 blur-[10px] opacity-0 transition-all duration-500 group-hover/leaf1:opacity-100 group-hover/leaf1:scale-110" />
</span>
<span data-alshafi-leaf data-speed="0.15" className="alshafi-leaf-2 group/leaf2 pointer-events-auto absolute right-[3vw] bottom-[16vh] z-[2] block w-[175px]">
  <img
    src="/lieaf-vector-002.webp"
    className="pointer-events-none w-full origin-center opacity-80 blur-[1.5px] will-change-transform transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/leaf2:-translate-x-[18px] group-hover/leaf2:translate-y-[12px] group-hover/leaf2:-rotate-[14deg] group-hover/leaf2:scale-[1.14]"
  />

  <span className="pointer-events-none absolute left-1/2 bottom-[-8px] h-[14px] w-[65%] -translate-x-1/2 rounded-full bg-black/40 blur-[12px] opacity-0 transition-all duration-700 group-hover/leaf2:opacity-100 group-hover/leaf2:scale-110" />
</span>
<span data-alshafi-leaf data-speed="0.2" className="alshafi-leaf-3 group/leaf3 pointer-events-auto absolute right-[14vw] bottom-[12vh] z-[2] block w-[145px]">
  <img
    src="/lieaf-vector-003.webp"
   className="pointer-events-none w-full origin-center opacity-70 blur-[2px] will-change-transform transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/leaf3:translate-x-[12px] group-hover/leaf3:-translate-y-[18px] group-hover/leaf3:rotate-[11deg] group-hover/leaf3:scale-[1.16]"
  />
  <span className="pointer-events-none absolute left-1/2 bottom-[-8px] h-[14px] w-[65%] -translate-x-1/2 rounded-full bg-black/40 blur-[12px] opacity-0 transition-all duration-700 group-hover/leaf2:opacity-100 group-hover/leaf2:scale-110" />
</span>
<span data-alshafi-leaf data-speed="0.25" className="group/leaf3 pointer-events-auto absolute right-[14vw] bottom-[12vh] z-[2] block w-[145px]">
  

</span>

<style>{`
@keyframes subtleShine {
  from { background-position: 200% center; }
  to { background-position: -200% center; }
}
.brand-text-shine {
  background: linear-gradient(
    110deg,
    #8f6823 0%,
    #c99a3a 42%,
    #f3d98a 48%,
    #c99a3a 54%,
    #8f6823 100%
  );
  background-size: 300% auto;
  background-position: 0% center;

  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  display: inline-block;
}

.group:hover .brand-text-shine {
  animation: subtleShine 5.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@media (min-width: 1080px) and (max-width: 1920px) {

  .alshafi-spice-main {
    left: 6vw;
    top: 4vh;
    width: 520px;
  }

  .alshafi-hero-card {
    width: 85%;
    transform: translateX(-35%);
  }

  .alshafi-hero-card > div {
    max-width: 680px;
  }

  .alshafi-hero-card a {
  padding: 6px 20px !important;
  font-size: 13px !important;
}

.alshafi-hero-card a.font-ar-title,
.alshafi-hero-card a.ku-title {
  padding: 5px 18px !important;
  font-size: 11px !important;
}

  .alshafi-crafted-text {
    font-size: 13px !important;
    letter-spacing: 0.60em !important;
    white-space: nowrap;
  }
/* 🔥 PREMIUM QUALITY */
  .alshafi-hero-card .tracking-\[0\.9em\] {
    font-size: 6px !important;
    letter-spacing: 0.4em !important;
  }

  .alshafi-hero-card .h-\[1px\].w-28 {
    width: 70px !important;
  }
  /* 🔥 خط‌ها */
  .alshafi-hero-card svg {
    width: 30px !important;
  }
  /* 🔥 آیکون وسط */
 .alshafi-hero-card .font-alshafi-logo {
  font-size: clamp(70px, 4.8vw, 90px) !important;
}

.alshafi-hero-card .font-ar-title,
.alshafi-hero-card .ku-title {
  font-size: clamp(54px, 4vw, 76px) !important;
  line-height: 1.2;
}

  /* 🔥 نور */
  .alshafi-card-back-glow {
    width: 150% !important;
    height: 340px !important;
    filter: blur(90px);
    opacity: 0.65;
  }

  /* 🔥 برگ‌ها (نزدیک کارت، نه پرت) */
 .alshafi-leaf-1 {
  right: 5%;
  bottom: 25%;
  width: 90px;
}

.alshafi-leaf-2 {
  right: 4%;
  bottom: 12%;
  width: 120px;
}

.alshafi-leaf-3 {
  right: 14%;
  bottom: 10%;
  width: 100px;
}

}`}
</style>     
 <span
   data-alshafi-leaf
  data-speed="0.2"
  className="alshafi-spice-main group/alen-spice pointer-events-auto absolute left-[9vw] top-[6vh] z-[0] block w-[420px] lg:w-[620px] 2xl:w-[840px]"
>
 <img
  src="/Alshafi-spices-003.webp"
  className="pointer-events-none w-full opacity-99 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/alen-spice:scale-[1.08]"
  style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.25))" }}
  draggable="false"
/>
</span>

      <div className="pointer-events-none absolute right-0 top-0 h-full w-[98%] z-0 overflow-hidden">
          <img
          src="/alshafi-hover.webp"
          alt="spices"
          
className="h-full w-full object-cover object-right"

        />
      </div>

      <div className="alshafi-hero-card relative z-10 isolate w-[92%] mx-auto px-4 translate-x-0 sm:w-[82%] md:w-[68%] lg:w-[58%] lg:mx-0 lg:px-[clamp(24px,5vw,90px)] lg:translate-x-[62%] xl:w-[52%] xl:translate-x-[80%] 2xl:w-[48%] 2xl:translate-x-[92%]">

        <div className="pointer-events-none absolute inset-x-4 top-0 bottom-0 z-0 lg:inset-x-[clamp(24px,5vw,90px)]">
        <div className="alshafi-card-back-glow absolute left-1/2 top-1/2 h-[300px] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-[56px] bg-gradient-to-r from-transparent via-[#c99a3a]/55 to-transparent blur-[360px] animate-[alshafiBackGlow_5s_ease-in-out_infinite] md:h-[380px] md:w-[150%] lg:h-[440px] lg:w-[160%] xl:h-[480px] xl:w-[170%] md:blur-[165px] lg:blur-[185px] xl:blur-[205px]" />
        </div>

        <div className="relative z-10 overflow-hidden rounded-[26px] p-[3px] md:rounded-[34px]">
          <div className="pointer-events-none absolute -inset-8 z-0">
            <div className="absolute h-60 w-60 rounded-full bg-[#c99a3a]/80 blur-[90px] animate-[alshafiOuterLamp_7s_linear_infinite] md:h-75 md:w-75 md:bg-[#c99a3a]/90 md:blur-[95px]" />
          </div>

          <div className="relative z-10 rounded-[26px] bg-gradient-to-br from-[#0a0a0a]/70 via-[#050505]/60 to-[#020202]/80 backdrop-blur-xl border border-[#c99a3a]/20 px-6 py-6 md:rounded-[34px] md:px-10 md:py-8 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.8)]">
           
 <div className="relative z-10" dir={isRtl ? "rtl" : "ltr"}>
            <h1 className={`leading-tight text-white ${langFont}`}>
  <div className="mb-0.5 flex flex-col items-center justify-center">
  <span className="text-center tracking-[0.9em] text-[#c99a3a]/75 text-[9px] md:text-xs">
    {copy.badge}
  </span>

  <div className="mt-0.5 flex items-center justify-center gap-1">
    <span className="h-[1px] w-28 bg-[#c99a3a]/50" />

    <svg width="46" height="30" viewBox="0 0 36 28" fill="none">
      <path d="M18 14C14 9 13 4 18 1C23 4 22 9 18 14Z" fill="#c99a3a" opacity="0.8" />
      <path d="M18 14C12 12 7 8 9 3C15 3 17 8 18 14Z" fill="#c99a3a" opacity="0.55" />
      <path d="M18 14C24 12 29 8 27 3C21 3 19 8 18 14Z" fill="#c99a3a" opacity="0.55" />
    </svg>

    <span className="h-[1px] w-28 bg-[#c99a3a]/50" />
  </div>
</div>

<span className={`group ${brandFont} ${brandSize} block text-center tracking-[0.01em] drop-shadow-[0_10px_24px_rgba(0,0,0,0.75)]`}
style={
    currentLang === "en"
      ? {
          background: "linear-gradient(to top, #8f6823 0%, #c99a3a 45%, #f3d98a 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }
    : {
  color: "#d2a847",
}
  }
>
<span className={`brand-text-shine ${brandTextFix} origin-center will-change-transform transform-gpu transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]`}>  {copy.brand.toLowerCase().replace(/^./, c => c.toUpperCase())}
</span></span>
  <span className="mx-auto mt-0.5 block w-fit text-[16px] sm:text-[20px] md:text-[26px] text-white/80 tracking-[0.3em]">
    {copy.spices}
  </span>


<div className="relative mt-1 flex flex-col items-center">
  <span className="alshafi-crafted-text block text-center text-[11px] sm:text-[13px] md:text-[16px] text-[#c99a3a]/70 tracking-[0.9em]">
    {copy.crafted}
  </span>

  {/* glow */}
  <div className="pointer-events-none absolute top-full mt-3 flex items-center justify-center">

  {/* line */}
 
 <div className="h-[2px] w-105 bg-gradient-to-r from-transparent via-[#c99a3a]/70 to-transparent" />

  {/* center glow */}
  <div className="absolute h-[0.5px] w-10 rounded-full bg-[#c99a3a]/80 blur-[2px]" />
 <div className="absolute h-[1px] w-45 rounded-full bg-[#c99a3a]/80 blur-[3px]" />
<div className="absolute h-[1.5px] w-30 rounded-full bg-[#c99a3a]/80 blur-[4px]" />
</div>
</div></h1>

              
             <div className="mt-6 md:mt-9 flex justify-center">
 <a
  href={`?lang=${currentLang}#products`}
  className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#c99a3a]/60 px-7 py-2.5 text-sm text-[#e6c37a] shadow-[0_0_0_rgba(201,154,58,0)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-[#f0cf7a] hover:text-[#f7d98b] hover:shadow-[0_10px_28px_-18px_rgba(240,207,122,0.75)] ${langFont}`}
>
  <span className="pointer-events-none absolute inset-0 rounded-full bg-[#c99a3a]/10 blur-[10px]" />
  <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c99a3a]/80 to-transparent" />
 <span className="pointer-events-none absolute -left-10 top-0 h-full w-10 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent blur-sm transition-transform duration-900 group-hover:translate-x-[210px]" />

  <span className="relative z-10">
    {copy.products}
  </span>
</a>
</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}