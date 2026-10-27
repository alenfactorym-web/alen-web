import AlshafiHero from "@/components/brands/alshafi/Hero";
import BrandSwitcherSection from "@/components/brands/BrandSwitcherSection";
import ProductsSection from "@/components/brands/alshafi/products/ProductsSection";
import VideoSection from "@/components/brands/alshafi/video/VideoSection";
import AlshafiAboutSection from "@/components/brands/alshafi/about/AboutSection";
import AlshafiContactSection from "@/components/brands/alshafi/contact/ContactSection";
import GolyRozhHero from "@/components/brands/goly-rozh/Hero";
import GolyRozhBrandSwitcherSection from "@/components/brands/goly-rozh/BrandSwitcherSection";
import GolyRozhProductsSection from "@/components/brands/goly-rozh/products/ProductsSection";
import { client } from "@/sanity/lib/client";
import GolyRozhVideoSection from "@/components/brands/goly-rozh/video/VideoSection";
import GolyRozhAboutSection from "@/components/brands/goly-rozh/about/AboutSection";
import GolyRozhContactSection from "@/components/brands/goly-rozh/contact/ContactSection";

export default async function BrandPage({ params, searchParams }) {
  const p = await Promise.resolve(params);
  const brand = String(p?.brand || "").toLowerCase();

  const sp = await Promise.resolve(searchParams);
  const lang = (sp?.lang || "en").toLowerCase();

 const brands =
  brand === "alshafi" || brand === "goly-rozh"
    ? await client.fetch(`
        *[_type == "brand"]{
          slug,
          name,
          "logo": logo.asset->url
        }
      `)
    : [];

  return (
    <main
      id="home"
      className={
        brand === "alshafi"
          ? "mini-site mini-site-alshafi"
          : brand === "goly-rozh"
            ? "mini-site mini-site-goly-rozh"
            : ""
      }
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
    : brand === "goly-rozh"
  ? {
      width: "100%",
      minHeight: "100vh",
      overflowX: "hidden",
      background: `
  radial-gradient(
    ellipse
      clamp(760px, 130vw, 1980px)
      clamp(620px, 95svh, 1200px)
      at 50% 105svh,
    rgba(255,255,255,0.95) 0%,
    rgba(255,255,255,0.68) 15%,
    rgba(255,255,255,0.28) 40%,
    transparent 65%
  ),
  #fcefd9
`,
    }
      : undefined
}
    >
      {brand === "alshafi" && (
        <AlshafiHero brand={brand} lang={lang} />
      )}

{brand === "goly-rozh" && (
  <GolyRozhHero brand={brand} />
)}

{brand === "goly-rozh" && (
  <GolyRozhBrandSwitcherSection
    brands={brands}
    activeBrand={brand}
  />
)}

{brand === "goly-rozh" && (
  <>
    <div className="goly-rozh-lower-shell">
      <GolyRozhProductsSection brand={brand} />
      <GolyRozhVideoSection />
    </div>

    <GolyRozhAboutSection />
  </>
)}
{brand === "goly-rozh" && (
  <GolyRozhContactSection />
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

      {brand !== "alshafi" && brand !== "goly-rozh" && (
        <div style={{ padding: 24 }}>
          <h1>Brand page: {brand}</h1>
          <p>This is the brand home.</p>
        </div>
      )}
    </main>
  );
}