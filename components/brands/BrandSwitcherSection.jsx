"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function BrandSwitcherSection({ brands = [], activeBrand, lang }) {
  const visibleBrands = brands.filter((b) => b?.slug?.current !== activeBrand);

  const displayBrands = [...visibleBrands];
  const plusIndex = displayBrands.findIndex((b) => b?.slug?.current === "alen-plus");
  const goliIndex = displayBrands.findIndex((b) => b?.slug?.current === "goli-alen");

  if (plusIndex !== -1 && goliIndex !== -1) {
    [displayBrands[plusIndex], displayBrands[goliIndex]] = [
      displayBrands[goliIndex],
      displayBrands[plusIndex],
    ];
  }

  if (!displayBrands.length) return null;

  return (
    <section id="brands" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px] 2xl:max-w-[1400px]">

        <div className="brand-switcher-inner ml-auto mr-0 max-w-[760px] translate-y-[30px] translate-x-[140px] [@media(min-width:768px)_and_(max-width:1180px)_and_(orientation:portrait)]:max-w-[650px] [@media(min-width:768px)_and_(max-width:1180px)_and_(orientation:portrait)]:translate-x-[2px]">

          <div className="flex items-center justify-center gap-10 lg:gap-14 2xl:gap-16 [@media(min-width:768px)_and_(max-width:1180px)_and_(orientation:portrait)]:gap-7">

            {displayBrands.map((brand) => (
              <Link
                key={brand.slug?.current}
                href={
                  brand.slug?.current === "alen"
                    ? `/?lang=${lang}`
                    : `/brand/${brand.slug?.current}?lang=${lang}`
                }
                className="block shrink-0"
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="flex items-center justify-center h-[80px] min-w-[110px] [@media(min-width:768px)_and_(max-width:1180px)_and_(orientation:portrait)]:h-[95px] [@media(min-width:768px)_and_(max-width:1180px)_and_(orientation:portrait)]:min-w-[130px]"
                >
                  {brand.logo && (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className={`w-auto object-contain ${
                        brand.slug?.current === "alen"
                          ? "h-16 lg:h-20 2xl:h-24 [@media(min-width:768px)_and_(max-width:1180px)_and_(orientation:portrait)]:h-[72px]"
                          : brand.slug?.current === "goly-rozh"
                            ? "h-10 lg:h-12 2xl:h-14 [@media(min-width:768px)_and_(max-width:1180px)_and_(orientation:portrait)]:h-12"
                            : "h-12 lg:h-14 2xl:h-16 [@media(min-width:768px)_and_(max-width:1180px)_and_(orientation:portrait)]:h-14"
                      }`}
                      draggable="false"
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="mx-auto mt-4 h-px w-[78%] bg-gradient-to-r from-transparent via-[#c99a3a]/80 to-transparent" />

          <div className="relative mx-auto mt-4 w-[78%] overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
            <div className="animate-[brandTextMarquee_7s_linear_infinite] whitespace-nowrap">
              <span
                className={`inline-block text-[20px] font-light tracking-[0.28em] text-[#e6c37a] ${
                  lang === "ar" ? "font-ar-title" : lang === "ku" ? "ku-title" : ""
                }`}
              >
                • {lang === "ar"
                  ? "اكتشف علاماتنا التجارية"
                  : lang === "ku"
                    ? "بڕاندەکانمان ببینە"
                    : "EXPLORE OUR BRANDS"} •
              </span>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes brandTextMarquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-60%);
          }
        }
      `}</style>
    </section>
  );
}