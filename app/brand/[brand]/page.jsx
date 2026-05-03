import AlshafiHero from "@/components/brands/alshafi/Hero";
import BrandSwitcherSection from "@/components/brands/BrandSwitcherSection";
import { client } from "@/sanity/lib/client";

export default async function BrandPage({ params, searchParams }) {
  const p = await Promise.resolve(params);
  const brand = String(p?.brand || "").toLowerCase();
  const sp = await Promise.resolve(searchParams);
const lang = (sp?.lang || "en").toLowerCase();

const brands = await client.fetch(`
  *[_type == "brand"]{
    slug,
    name,
    "logo": logo.asset->url
  }
`);

  return (
    <main id="home">
      {brand === "alshafi" && <AlshafiHero brand={brand} lang={lang} />}

            {brand === "alshafi" && (
  <BrandSwitcherSection
    brands={brands}
    activeBrand={brand}
    lang={lang}
  />
)}

      {brand === "alshafi" && (
        <section id="products" className="relative px-6 py-24">
<div className="mx-auto max-w-[1200px] translate-x-[400px]">
            <div className="mb-12 text-center">
              <p className="text-sm font-bold tracking-[0.25em] text-[#c99a3a]">
                EXPLORE
              </p>
              <h2 className="mt-3 text-4xl font-light text-[#e6c37a]">
                ALSHAFI COLLECTION
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <a
                href={`/brand/${brand}/products`}
                className="rounded-3xl bg-[#111] p-8 border border-[#c99a3a]/20 shadow-[0_20px_60px_-30px_rgba(201,154,58,0.25)]"
              >
                <h3 className="text-2xl font-semibold text-[#e6c37a]">Products</h3>
                <p className="mt-3 text-sm text-zinc-400">
                  Browse premium spice categories.
                </p>
              </a>

              <a
                href={`/brand/${brand}/videos`}
                className="rounded-3xl bg-[#111] p-8 border border-[#c99a3a]/20 shadow-[0_20px_60px_-30px_rgba(201,154,58,0.25)]"
              >
                <h3 className="text-2xl font-semibold text-[#e6c37a]">Videos</h3>
                <p className="mt-3 text-sm text-zinc-400">
                  Discover recipes and brand stories.
                </p>
              </a>

              <a
                href={`/brand/${brand}/news`}
                className="rounded-3xl bg-[#111] p-8 border border-[#c99a3a]/20 shadow-[0_20px_60px_-30px_rgba(201,154,58,0.25)]"
              >
                <h3 className="text-2xl font-semibold text-[#e6c37a]">News</h3>
                <p className="mt-3 text-sm text-zinc-400">
                  Follow the latest updates.
                </p>
              </a>
            </div>
          </div>
        </section>
      )}

      {brand !== "alshafi" && (
        <div style={{ padding: 24 }}>
          <h1>Brand page: {brand}</h1>
          <p>This is the brand home.</p>
        </div>
      )}
    </main>
  );
}