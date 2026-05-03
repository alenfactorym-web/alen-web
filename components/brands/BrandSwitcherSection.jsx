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
        <div className="ml-auto mr-0 max-w-[760px] translate-y-[30px] translate-x-[140px]">
          <div className="flex items-center justify-center gap-10 lg:gap-14 2xl:gap-16">
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
                  className="flex h-[80px] min-w-[110px] items-center justify-center"
                >
                  {brand.logo && (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className={`w-auto object-contain ${
                        brand.slug?.current === "alen"
                          ? "h-16 lg:h-20 2xl:h-24"
                          : brand.slug?.current === "goly-rozh"
                            ? "h-10 lg:h-12 2xl:h-14"
                            : "h-12 lg:h-14 2xl:h-16"
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
    <span className="inline-block text-[20px] font-light tracking-[0.28em] text-[#e6c37a]">
      • EXPLORE OUR BRANDS •
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