"use client";

import "./globals.css";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AlenPatternOverlayWaves from "@/components/ui/AlenPatternOverlayWaves";
import CursorTrail from "@/components/ui/CursorTrail";
import { LanguageProvider } from "../components/providers/LanguageProvider";
import SiteChrome from "@/components/locked/SiteChrome";
import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({ children }) {
const [scrollY, setScrollY] = useState(0);
const pathname = usePathname();  
const [showAlenEffects, setShowAlenEffects] = useState(false);

useEffect(() => {
  const path = pathname || "/";
  setShowAlenEffects(!path.startsWith("/brand") || path.startsWith("/brand/alen"));

    const handleScroll = () => {
      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <html lang="en">
      <head>
        <style>{`
          @keyframes patternBreath {
            0%, 100% { transform: scale(1); }
            70% { transform: scale(1.1); }
          }
          @keyframes lightBreath {
            0%, 100% { opacity: 0.5; transform: scale(1) translateY(0); }
            50% { opacity: 1; transform: scale(1.1) translateY(20px); }
          }
        `}</style>
      </head>

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
                opacity: "var(--pattern-opacity, 0.2)",
                filter: "contrast(var(--pattern-boost, 1))",
                backgroundPosition: `center ${-scrollY * 0.1}px`,
                animation: "patternBreath 6s ease-in-out infinite",
                willChange: "transform, background-position",
              }}
            >
              <div
                className="absolute inset-x-0"
                style={{
                  top: "-30%",
                  height: "160%",
                  background: `radial-gradient(circle at 50% 50%, 
                    rgba(251, 191, 36, 0.15) 0%, 
                    transparent 95%)`,
                  transform: `translate3d(0, ${scrollY * 0.05}px, 0)`,
                  mixBlendMode: "screen",
                  animation: "lightBreath 6s ease-in-out infinite",
                  willChange: "transform",
                }}
              />
            </div>

            <AlenPatternOverlayWaves />

            <CursorTrail
              color={[255, 220, 90]}
              opacity={0.8}
              lifeMs={520}
              maskToPattern={true}
            />
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