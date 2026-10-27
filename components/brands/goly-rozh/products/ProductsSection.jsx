import { client } from "@/sanity/lib/client";
import GolyRozhProductsSectionClient from "./ProductsSectionClient";

export default async function ProductsSection({
  brand = "goly-rozh",
}) {
  const categories = await client.fetch(
    `
      *[
        _type == "category" &&
        brand->slug.current == $brand &&
        coalesce(isActive, true) == true
      ]
      | order(coalesce(order, 999999) asc, _createdAt asc) {
        _id,
        "slug": slug.current,
        title,
        "image": coverImage.asset->url
      }
    `,
    { brand },
  );

  return (
    <GolyRozhProductsSectionClient
      brand={brand}
      categories={categories}
    />
  );
}