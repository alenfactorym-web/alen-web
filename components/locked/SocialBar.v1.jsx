"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Instagram, Facebook, Youtube, MessageCircle, X } from "lucide-react";

function TikTokIcon({ className = "", strokeWidth = 1.8 }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M14 3v11.2a3.8 3.8 0 1 1-3.2-3.75V7.2a7 7 0 1 0 7.2 7V9.7c1.2.8 2.6 1.3 4 1.4V7.6c-2.3-.2-4.2-1.7-5-4.6H14Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ✅ لینک‌های سوشیال پیش‌فرض ALEN
const defaultSocials = [
  { name: "Instagram", href: "https://www.instagram.com/alen_factory", icon: Instagram },
  { name: "Facebook", href: "https://www.facebook.com/AlenGroup", icon: Facebook },
  { name: "YouTube", href: "https://www.youtube.com/@alenfactory", icon: Youtube },
  { name: "TikTok", href: "https://www.tiktok.com/@alenfactory", icon: TikTokIcon },
];

// ✅ فقط برای مینی‌سایت‌ها این ۴ لینک عوض می‌شوند
const brandSocials = {
  alshafi: [
    { name: "Instagram", href: "https://www.instagram.com/alshafi.group", icon: Instagram },
    { name: "Facebook", href: "https://www.facebook.com/share/18sfVCCsGC", icon: Facebook },
    { name: "YouTube", href: "https://www.youtube.com/@Alshafibrand", icon: Youtube },
    { name: "TikTok", href: "https://www.tiktok.com/@alshafi_group", icon: TikTokIcon },
  ],

  // بعداً برای برندهای بعدی همین‌جا اضافه می‌کنیم:
  // "goly-rozh": [...],
  // "goli-alen": [...],
  // "alen-plus": [...],
};
const whatsappLinks = [
  {
    name: "Customer Service / Korek",
    href: "https://wa.me/9647507263333?text=Hello%20ALEN%20Factory",
  },
  {
    name: "Customer Service / Asiacell",
    href: "https://wa.me/9647707263333?text=Hello%20ALEN%20Factory",
  },
];

function SocialIcon({ name, href, Icon, compact = false }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={name}>
      <motion.div whileHover={{ x: 2 }} className="group relative flex items-center" title={name}>
        <span className="pointer-events-none absolute -inset-4 opacity-0 group-hover:opacity-100 transition duration-300 rounded-full bg-yellow-400/25 blur-xl" />

        <motion.div
          whileHover={{ scale: 1.08, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className={[
            "relative flex items-center justify-center rounded-full",
            "bg-white/20 backdrop-blur-md border border-white/20",
            "shadow-[0_10px_30px_rgba(0,0,0,0.10)]",
            compact ? "h-9 w-9" : "h-10 w-10",
          ].join(" ")}
        >
          <Icon
            className={[
              "text-zinc-900 drop-shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition duration-300 group-hover:text-black",
              compact ? "h-5 w-5" : "h-6 w-6",
            ].join(" ")}
          />
        </motion.div>

        {!compact && (
          <div className="pointer-events-none absolute left-12 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition duration-200">
            <div className="whitespace-nowrap rounded-full bg-black/80 text-white text-xs font-black px-3 py-1 shadow-xl">
              {name}
            </div>
          </div>
        )}
      </motion.div>
    </a>
  );
}

function WhatsAppIconSingle({ compact = false }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function onDocDown(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("touchstart", onDocDown);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("touchstart", onDocDown);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative group">
      <button type="button" aria-label="WhatsApp" onClick={() => setOpen((v) => !v)} className="block">
        <motion.div whileHover={{ x: 2 }} className="relative flex items-center">
          <span className="pointer-events-none absolute -inset-4 opacity-0 group-hover:opacity-100 transition duration-300 rounded-full bg-yellow-400/25 blur-xl" />

          <motion.div
            whileHover={{ scale: 1.08, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={[
              "relative flex items-center justify-center rounded-full",
              "bg-white/20 backdrop-blur-md border border-white/20",
              "shadow-[0_10px_30px_rgba(0,0,0,0.10)]",
              compact ? "h-9 w-9" : "h-10 w-10",
            ].join(" ")}
          >
            <MessageCircle className={compact ? "h-5 w-5 text-zinc-900" : "h-6 w-6 text-zinc-900"} />
          </motion.div>
        </motion.div>
      </button>

      <div
        className={[
          "absolute left-12 top-1/2 -translate-y-1/2",
          "transition duration-200",
          "flex flex-col gap-2",
          "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
          open ? "opacity-100 pointer-events-auto" : "",
        ].join(" ")}
      >
        {whatsappLinks.map((w) => (
          <a
            key={w.name}
            href={w.href}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-full bg-black/80 text-white text-xs font-black px-3 py-1 shadow-xl hover:bg-black"
            onClick={() => setOpen(false)}
          >
            {w.name}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function SocialBarV1() {
  const params = useParams();
  const brand = String(params?.brand || "").toLowerCase();
  const activeSocials = brandSocials[brand] || defaultSocials;

  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef(null);

  const [hideOnMobileScroll, setHideOnMobileScroll] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    function onDocDown(e) {
      if (!mobileRef.current) return;
      if (!mobileRef.current.contains(e.target)) setMobileOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("pointerdown", onDocDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onDocDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastY = window.scrollY;

    const isMobile = () =>
      window.matchMedia &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    const onScroll = () => {
      if (!isMobile()) {
        setHideOnMobileScroll(false);
        return;
      }

      const y = window.scrollY;

      if (y > lastY && y > 120) {
        setHideOnMobileScroll(true);
      } else {
        setHideOnMobileScroll(false);
      }

      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ✅ دسکتاپ: مثل قبل */}
     <div
  className={[
    "hidden lg:flex fixed left-6 bottom-6 z-50 flex-col gap-3",
    "transition-all duration-300 ease-out",
    hideOnMobileScroll ? "translate-y-[220%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100",
    "[@media(hover:hover)_and_(pointer:fine)]:translate-y-0 [@media(hover:hover)_and_(pointer:fine)]:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:pointer-events-auto",
  ].join(" ")}
>

      {activeSocials.map((s) => {
  const Icon = s.icon;
  return <SocialIcon key={s.name} name={s.name} href={s.href} Icon={Icon} />;
})}
        <WhatsAppIconSingle />
      </div>

      {/* ✅ موبایل: دکمه جدا پایین + پنل جدا */}
      <div
        ref={mobileRef}
        className={[
          "lg:hidden fixed left-4 bottom-4 z-[2147483647] pointer-events-auto",
          "transition-all duration-300 ease-out",
          hideOnMobileScroll ? "translate-y-[220%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100",
        ].join(" ")}
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMobileOpen((v) => !v);
          }}
          className="px-3 py-2 rounded-full text-[11px] font-black shadow-lg border border-black/10 bg-white/70 backdrop-blur-md text-zinc-900"
        >
          <span className="relative">SOCIAL</span>
        </button>

        {mobileOpen && (
          <div className="mt-3 w-[min(320px,85vw)] rounded-2xl border border-black/10 bg-white/85 backdrop-blur-xl shadow-2xl p-3">
            {/* ✅ آیکن‌ها فقط یک بار (compact) */}
            <div className="flex items-center gap-2 flex-wrap">
              {activeSocials.map((s) => {
  const Icon = s.icon;
  return (
    <SocialIcon
      key={s.name}
      name={s.name}
      href={s.href}
      Icon={Icon}
      compact
    />
  );
})}
              <WhatsAppIconSingle compact />
            </div>

            {/* ✅ لینک‌های واتس‌اپ */}
            <div className="mt-3">
              {whatsappLinks.map((w) => (
                <a
                  key={w.name}
                  href={w.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 rounded-xl px-3 py-2 text-[11px] font-black text-zinc-900 bg-black/5 hover:bg-black/10"
                  onClick={() => setMobileOpen(false)}
                >
                  {w.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

