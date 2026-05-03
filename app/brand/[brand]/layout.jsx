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

  const bg =
    brand === "alshafi"
      ? {
          type: "split",
          light: "#fdfcf9",
          dark: ["#070707", "#111111"],
          splitAt: "26%",
        }
      : null;

  return (
    <div
      data-brand={brand}
      data-brand-logo={data?.logoUrl || ""}
      className={`brand-site brand-${brand} w-full overflow-x-hidden`}
      style={
        bg?.type === "split"
          ? {
              background: `linear-gradient(
  90deg,
  #ffffff 0%,
  #fbfaf6 ${bg.splitAt},
  #c99a3a ${bg.splitAt},
  #c99a3a calc(${bg.splitAt} + 10px),
  ${bg.dark[0]} calc(${bg.splitAt} + 10px),
  ${bg.dark[1]} 100%
)`,
              width: "100%",
              overflowX: "hidden",
              minHeight: "100vh",
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}