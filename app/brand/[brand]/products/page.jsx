export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";
import BrandProductsClient from "./ui.client";

export default async function BrandProductsPage({ params }) {
  const p = await Promise.resolve(params);
  const brand = String(p?.brand || "alen").toLowerCase();

  const query = `
    *[_type=="category" && brand->slug.current==$brand]
    | order(coalesce(order, 999999) asc, _createdAt asc){
      _id,
      "slug": slug.current,
      title,
      "image": coverImage.asset->url,
      "order": order
    }
  `;

  const initialCategories = await client.fetch(query, { brand });

  return (
    <BrandProductsClient
      brand={brand}
      initialCategories={Array.isArray(initialCategories) ? initialCategories : []}
    />
  );
}