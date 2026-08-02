import AlshafiHero from "@/components/brands/alshafi/Hero";
import BrandSwitcherSection from "@/components/brands/BrandSwitcherSection";
import ProductsSection from "@/components/brands/alshafi/products/ProductsSection";
import VideoSection from "@/components/brands/alshafi/video/VideoSection";
import AlshafiAboutSection from "@/components/brands/alshafi/about/AboutSection";
import AlshafiContactSection from "@/components/brands/alshafi/contact/ContactSection";
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
  <main
    id="home"
    className={brand === "alshafi" ? "mini-site mini-site-alshafi" : ""}
    style={
      brand === "alshafi"
        ? {
            width: "100%",
            minHeight: "100vh",
            overflowX: "hidden",
            background: `linear-gradient(
              90deg,
              #ffffff 0%,
              #fbfaf6 26%,
              #c99a3a 26%,
              #c99a3a calc(26% + 10px),
              #070707 calc(26% + 10px),
              #111111 100%
            )`,
          }
        : undefined
    }
  >
      {brand === "alshafi" && (
        <AlshafiHero brand={brand} lang={lang} />
      )}

      {brand === "alshafi" && (
        <BrandSwitcherSection
          brands={brands}
          activeBrand={brand}
          lang={lang}
        />
      )}

      {brand === "alshafi" && (
        <ProductsSection brand={brand} lang={lang} />
      )}
{brand === "alshafi" && (
  <VideoSection lang={lang} />
)}
{brand === "alshafi" && (
  <AlshafiAboutSection lang={lang} />
)}
{brand === "alshafi" && (
  <AlshafiContactSection lang={lang} />
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