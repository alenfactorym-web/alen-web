import { client } from "@/sanity/lib/client";

export default async function BrandLayout({ children, params }) {
  const p = await Promise.resolve(params);
  const brand = String(p?.brand || "alen").toLowerCase();

  const data = await client.fetch(
    `*[_type == "brand" && slug.current == $brand][0]{
      "logoUrl": logo.asset->url
    }`,
    { brand }
  );

  return (
    <div
      data-brand={brand}
      data-brand-logo={data?.logoUrl || ""}
      className={`brand-site brand-${brand} w-full overflow-x-hidden`}
      style={{
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        background: brand === "alshafi" ? "#080808" : undefined,
      }}
    >
      {children}
    </div>
  );
}