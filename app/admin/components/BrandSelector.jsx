"use client";

import { useEffect, useState } from "react";

export default function BrandSelector({ brand, setBrand }) {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    async function loadBrands() {
      try {
        const res = await fetch("/api/admin/brands", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          console.error("BRAND SELECTOR LOAD ERROR:", data);
          return;
        }

        setBrands(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("BRAND SELECTOR FETCH ERROR:", err);
      }
    }

    loadBrands();
  }, []);

  return (
    <select
      value={brand}
      onChange={(e) => setBrand(e.target.value)}
      className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm outline-none transition focus:border-black/20 dark:border-white/10 dark:bg-[#4b5159] dark:text-white"
    >
      {brands.map((b) => (
        <option key={b._id} value={b.slugValue}>
          {b.title_en || "Untitled"}
        </option>
      ))}
    </select>
  );
}

