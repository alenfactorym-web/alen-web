export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import BrandCategoryClient from "./ui.client";

export default async function BrandCategoryPage({ params, searchParams }) {
  const p = await Promise.resolve(params);
  const sp = await Promise.resolve(searchParams);

  const brand = String(p?.brand || "alen").toLowerCase();
  const category = String(p?.category || "").toLowerCase();

  const langRaw = (sp?.lang || "en").toString().toLowerCase();
  const lang = ["en", "ar", "ku"].includes(langRaw) ? langRaw : "en";

 const [initialProductGroups, initialPackaging, directProductsCount] = await Promise.all([
  client.fetch(
    `
    *[
      _type=="productGroup" &&
      brand->slug.current==$brand &&
      category->slug.current==$category &&
      coalesce(isActive,true)==true
    ]
   | order(coalesce(order, 9999) asc, _createdAt asc){
  _id,
  "slug": slug.current,
  title,
  "image": image.asset->url,
  "order": order
}
    `,
    { brand, category }
  ),
  client.fetch(
    `
    *[
      _type=="packaging" &&
      brand->slug.current==$brand &&
      category->slug.current==$category &&
      !defined(productGroup) &&
      coalesce(isActive,true)==true
    ]
    | order(coalesce(order, 9999) asc, _createdAt asc){
      _id,
      "slug": slug.current,
      title,
      "image": image.asset->url,
      "order": order
    }
    `,
    { brand, category }
  ),
  client.fetch(
    `
    count(*[
      _type=="product" &&
      brand->slug.current==$brand &&
      category->slug.current==$category &&
      !defined(productGroup) &&
      !defined(packaging) &&
      coalesce(isActive,true)==true
    ])
    `,
    { brand, category }
  ),
]);

 
if ((!initialPackaging || initialPackaging.length === 0) && Number(directProductsCount || 0) > 0) {
  redirect(`/brand/${brand}/products/${category}/direct?lang=${lang}&page=1`);
}

 const categories = await client.fetch(
  `*[_type=="category" && brand->slug.current==$brand]
   | order(coalesce(order, 999999) asc, _createdAt asc){
     "slug": slug.current,
     title
   }`,
  { brand }
);

return (
 <BrandCategoryClient
  brand={brand}
  category={category}
  lang={lang}
  initialProductGroups={Array.isArray(initialProductGroups) ? initialProductGroups : []}
  initialPackaging={Array.isArray(initialPackaging) ? initialPackaging : []}
  allCategories={Array.isArray(categories) ? categories : []}
/>
);
}