"use client";

import "./globals.css";
import "@/styles/mini-sites.css";
import "@/styles/alshafi-motion.css";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import AlenPatternOverlayWaves from "@/components/ui/AlenPatternOverlayWaves";
import { LanguageProvider } from "../components/providers/LanguageProvider";
import SiteChrome from "@/components/locked/SiteChrome";
import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const path = pathname || "/";

  const showAlenEffects =
    !path.startsWith("/brand") || path.startsWith("/brand/alen");

  return (
    <html lang="en">
      <body className="antialiased relative isolate bg-transparent">
        {showAlenEffects && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
              style={{
                backgroundImage: "url('/patterns/pattern.png')",
                backgroundRepeat: "repeat",
                backgroundSize:
                  "var(--pattern-size, 300px) var(--pattern-size, 300px)",
                backgroundPosition: "center center",
                opacity: "var(--pattern-opacity, 0.2)",
                filter: "contrast(var(--pattern-boost, 1))",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0"
                style={{
                  top: "-30%",
                  height: "160%",
                  background: `radial-gradient(
                    circle at 50% 50%,
                    rgba(251, 191, 36, 0.15) 0%,
                    transparent 95%
                  )`,
                  mixBlendMode: "screen",
                }}
              />
            </div>

            <AlenPatternOverlayWaves />
          </>
        )}

        <div className="relative z-10">
          <Suspense fallback={null}>
            <LanguageProvider>
              <SmoothScroll>
                <SiteChrome />
                {children}
              </SmoothScroll>
            </LanguageProvider>
          </Suspense>
        </div>
      </body>
    </html>
  );
}