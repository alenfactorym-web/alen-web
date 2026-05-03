export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";
import HomeClient from "./HomeClient";

export default async function HomePage() {
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

  const initialCategories = await client.fetch(query, { brand: "alen" });

  return <HomeClient initialCategories={Array.isArray(initialCategories) ? initialCategories : []} />;
}

