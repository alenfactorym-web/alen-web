"use client";

import "./globals.css";
import "@/styles/mini-sites.css";
import "@/styles/alshafi-motion.css";
import "@/styles/goly-rozh-motion.css";
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
>
  {/* Old ALEN pattern — hidden on Large Monitor and Laptop */}
<div
  aria-hidden="true"
  className="absolute inset-0
    [@media(min-width:1280px)_and_(min-height:900px)_and_(orientation:landscape)]:hidden
    [@media(min-width:1367px)_and_(max-width:1536px)_and_(max-height:899px)_and_(orientation:landscape)]:hidden"
  style={{
    backgroundImage: "url('/patterns/pattern.png')",
    backgroundRepeat: "repeat",
    backgroundSize: "800px 800px",
    backgroundPosition: "center center",
    opacity: 0.45,
  }}
/>

  {/* Original golden glow */}
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