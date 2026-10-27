export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";
import PackagingGalleryClient from "./ui.client";
import ProductGroupPageClient from "@/components/brands/alshafi/products/product-group/ProductGroupPageClient";
import GolyRozhProductGalleryClient from "@/components/brands/goly-rozh/products/gallery/golyrozhProductGalleryClient";
const PER_PAGE = 12;

export default async function PackagingGalleryPage({ params, searchParams }) {
  const p = await Promise.resolve(params);

const brand = String(p?.brand || "alen").toLowerCase();
const category = String(p?.category || "").toLowerCase();
const slug = String(p?.packaging || "").toLowerCase();

const sp = await Promise.resolve(searchParams);
const langRaw = (sp?.lang || "en").toString().toLowerCase();
const lang = ["en", "ar", "ku"].includes(langRaw) ? langRaw : "en";

const isDirectProducts = slug === "direct";

const page = Math.max(1, parseInt(sp?.page || "1", 10) || 1);
const start = (page - 1) * PER_PAGE;
const end = start + PER_PAGE;

/* =========================================================
   ALSHAFI DIRECT PRODUCTS — FAST PATH
   One Sanity request instead of running the full page queries
   ========================================================= */

if (brand === "alshafi" && isDirectProducts) {
  const directData = await client.fetch(
    `{
      "list": *[
        _type=="product" &&
        brand->slug.current==$brand &&
        category->slug.current==$category &&
        !defined(productGroup) &&
        !defined(packaging) &&
        coalesce(isActive,true)==true
      ]
      | order(coalesce(order,999999) asc, _createdAt asc)
      [$start...$end]{
        _id,
        "id": coalesce(sku,_id),
        "image": coalesce(
          coverImage.asset->url,
          images[0].asset->url
        ),
        "name": title,
        unitsPerPack,
        packsPerCarton,

        "productGroup": productGroup->{
          title,
          "slug": slug.current
        },

        "productGroupTitle": productGroup->title,
        "productGroupSlug": productGroup->slug.current
      },

      "total": count(*[
        _type=="product" &&
        brand->slug.current==$brand &&
        category->slug.current==$category &&
        !defined(productGroup) &&
        !defined(packaging) &&
        coalesce(isActive,true)==true
      ]),

      "categories": *[
        _type=="category" &&
        brand->slug.current==$brand &&
        coalesce(isActive,true)==true
      ]
      | order(coalesce(order,999999) asc, _createdAt asc){
        _id,
        "slug": slug.current,
        title,

        "hasProductGroups": count(*[
          _type=="productGroup" &&
          brand->slug.current==$brand &&
          category._ref==^._id &&
          coalesce(isActive,true)==true
        ]) > 0,

        "hasPackaging": count(*[
          _type=="packaging" &&
          brand->slug.current==$brand &&
          category._ref==^._id &&
          coalesce(isActive,true)==true
        ]) > 0,

        "hasDirectProducts": count(*[
          _type=="product" &&
          brand->slug.current==$brand &&
          category._ref==^._id &&
          !defined(productGroup) &&
          !defined(packaging) &&
          coalesce(isActive,true)==true
        ]) > 0
      }
    }`,
    {
      brand,
      category,
      start,
      end,
    }
  );

const currentDirectCategory =
  Array.isArray(directData?.categories)
    ? directData.categories.find(
        (item) =>
          String(item?.slug || "").toLowerCase() === category
      )
    : null;

  return (
    <ProductGroupPageClient
      brand={brand}
      category={category}
      group="direct"
      lang={lang}
      serverItems={
        Array.isArray(directData?.list)
          ? directData.list
          : []
      }
    serverPackTitle={
  currentDirectCategory?.title ?? {
    en: category.replace(/-/g, " "),
    ar: "",
    ku: "",
  }
}
      serverProductGroupsList={[]}
      allCategories={
        Array.isArray(directData?.categories)
          ? directData.categories
          : []
      }
      page={page}
      perPage={PER_PAGE}
      total={Number(directData?.total || 0)}
    />
  );
}

const [groupExists, currentPackagingMeta] = await Promise.all([
  isDirectProducts
    ? 0
    : client.fetch(
        `count(*[
          _type=="productGroup" &&
          brand->slug.current==$brand &&
          category->slug.current==$category &&
          slug.current==$slug &&
          coalesce(isActive,true)==true
        ])`,
        { brand, category, slug }
      ),

  isDirectProducts
    ? null
    : client.fetch(
        `*[
          _type=="packaging" &&
          brand->slug.current==$brand &&
          category->slug.current==$category &&
          slug.current==$slug &&
          coalesce(isActive,true)==true
        ][0]{
          "productGroupSlug": productGroup->slug.current,
          "productGroupTitle": productGroup->title
        }`,
        { brand, category, slug }
      ),
]);

const isGroupPage = groupExists > 0;

const activeProductGroupSlug = isGroupPage
  ? slug
  : currentPackagingMeta?.productGroupSlug || "";

const isPackagingUnderGroup =
  !isDirectProducts && !isGroupPage && !!activeProductGroupSlug;

const defaultPackagingQuery = `
  *[
    _type=="packaging" &&
    brand->slug.current==$brand &&
    category->slug.current==$category &&
    !defined(productGroup) &&
    coalesce(isActive,true)==true
  ]
  | order(coalesce(order, 9999) asc, title.en asc, _createdAt asc){
    "slug": slug.current,
    title,
    "image": image.asset->url,
    cartonQty
  }
`;

const groupPackagingQuery = `
  *[
    _type=="packaging" &&
    brand->slug.current==$brand &&
    category->slug.current==$category &&
    productGroup->slug.current==$activeProductGroupSlug &&
    coalesce(isActive,true)==true
  ]
  | order(coalesce(order, 9999) asc, title.en asc, _createdAt asc){
    "slug": slug.current,
    title,
    "image": image.asset->url,
    cartonQty
  }
`;

const packQuery =
  isDirectProducts
    ? defaultPackagingQuery
    : (isGroupPage || isPackagingUnderGroup)
    ? groupPackagingQuery
    : defaultPackagingQuery;  
const totalQuery = isDirectProducts
  ? `
    count(*[
      _type=="product" &&
      brand->slug.current==$brand &&
      category->slug.current==$category &&
      !defined(productGroup) &&
      !defined(packaging) &&
      coalesce(isActive,true)==true
    ])
  `
  : isGroupPage
  ? 
brand === "alshafi"
    ? `
      count(*[
        _type=="product" &&
        brand->slug.current==$brand &&
        category->slug.current==$category &&
        productGroup->slug.current==$slug &&
        coalesce(isActive,true)==true
      ]
)
    `
    : `
  count(*[
    _type=="product" &&
    brand->slug.current==$brand &&
    category->slug.current==$category &&
    (
      productGroup->slug.current==$slug ||
      packaging->productGroup->slug.current==$slug
    ) &&
    coalesce(isActive,true)==true
  ])
`
  : `
    count(*[
      _type=="product" &&
      brand->slug.current==$brand &&
      category->slug.current==$category &&
      packaging->slug.current==$slug &&
      coalesce(isActive,true)==true
    ])
  `;

const productsQuery = isDirectProducts
  ? `
    *[
      _type=="product" &&
      brand->slug.current==$brand &&
      category->slug.current==$category &&
      !defined(productGroup) &&
      !defined(packaging) &&
      coalesce(isActive,true)==true
    ]
    | order(coalesce(order, 999999) asc, _createdAt asc)
    [ $start...$end ]
   {
  _id,
  "id": coalesce(sku, _id),
  "image": coalesce(coverImage.asset->url, images[0].asset->url),
  "name": title,
  "unitsPerPack": unitsPerPack,
  "packsPerCarton": packsPerCarton,

  "productGroup": productGroup->{
    title,
    "slug": slug.current
  },
  "productGroupTitle": productGroup->title,
  "productGroupSlug": productGroup->slug.current
}
  `
  : isGroupPage
  ? 
brand === "alshafi"
    ? `
      *[
        _type=="product" &&
        brand->slug.current==$brand &&
        category->slug.current==$category &&
        productGroup->slug.current==$slug &&
        coalesce(isActive,true)==true
      ]
      | order(coalesce(order, 999999) asc, _createdAt asc)
      [ $start...$end ]
      {
        _id,
        "id": coalesce(sku, _id),
        "image": coalesce(coverImage.asset->url, images[0].asset->url),
        "name": title,
        "unitsPerPack": unitsPerPack,
        "packsPerCarton": packsPerCarton,

        "productGroup": productGroup->{
          title,
          "slug": slug.current
        },
        "productGroupTitle": productGroup->title,
        "productGroupSlug": productGroup->slug.current
      }
    `    : `
      *[
        _type=="product" &&
        brand->slug.current==$brand &&
        category->slug.current==$category &&
        (
  productGroup->slug.current==$slug ||
  packaging->productGroup->slug.current==$slug
) &&
        coalesce(isActive,true)==true
      ]
      | order(coalesce(order, 999999) asc, _createdAt asc)
      [ $start...$end ]
      {
        _id,
        "id": coalesce(sku, _id),
        "image": coalesce(coverImage.asset->url, images[0].asset->url),
        "name": title,
        "unitsPerPack": unitsPerPack,
        "packsPerCarton": packsPerCarton
      }
    `
  : `
    *[
      _type=="product" &&
      brand->slug.current==$brand &&
      category->slug.current==$category &&
      packaging->slug.current==$slug &&
      coalesce(isActive,true)==true
    ]
    | order(coalesce(order, 999999) asc, _createdAt asc)
    [ $start...$end ]
    {
      _id,
      "id": coalesce(sku, _id),
      "image": coalesce(coverImage.asset->url, images[0].asset->url),
      "name": title,
      "unitsPerPack": unitsPerPack,
      "packsPerCarton": packsPerCarton
    }
  `;
 const [packagingList, total, list, categories, currentProductGroup, productGroupsList] = await Promise.all([
  client.fetch(packQuery, { brand, category, slug, activeProductGroupSlug }),
  client.fetch(totalQuery, { brand, category, slug }),
  client.fetch(productsQuery, { brand, category, slug, start, end }),
  client.fetch(
  `*[
    _type=="category" &&
    brand->slug.current==$brand &&
    coalesce(isActive,true)==true
  ]
  | order(coalesce(order, 999999) asc, _createdAt asc){
    _id,
    "slug": slug.current,
    title,

    "hasProductGroups": count(*[
      _type=="productGroup" &&
      brand->slug.current==$brand &&
      category._ref==^._id &&
      coalesce(isActive,true)==true
    ]) > 0,

    "hasPackaging": count(*[
      _type=="packaging" &&
      brand->slug.current==$brand &&
      category._ref==^._id &&
      coalesce(isActive,true)==true
    ]) > 0,

    "hasDirectProducts": count(*[
      _type=="product" &&
      brand->slug.current==$brand &&
      category._ref==^._id &&
      !defined(productGroup) &&
      !defined(packaging) &&
      coalesce(isActive,true)==true
    ]) > 0
  }`,
  { brand }
),
isDirectProducts
  ? null
  : client.fetch(
      `*[
        _type=="productGroup" &&
        brand->slug.current==$brand &&
        category->slug.current==$category &&
        slug.current==$groupSlug &&
        coalesce(isActive,true)==true
      ][0]{
        title
      }`,
      {
        brand,
        category,
        groupSlug: isGroupPage ? slug : activeProductGroupSlug,
      }
    ),
  client.fetch(
    `*[
      _type=="productGroup" &&
      brand->slug.current==$brand &&
      category->slug.current==$category &&
      coalesce(isActive,true)==true
    ] | order(coalesce(order,9999) asc, _createdAt asc){
      "slug": slug.current,
      title,
      "image": image.asset->url
    }`,
    { brand, category }
  ),
]);
  

const serverPackagingList = Array.isArray(packagingList) ? packagingList : [];

const currentPack = isDirectProducts
  ? null
  : serverPackagingList.find(
      (x) => String(x?.slug || "").toLowerCase() === slug
    ) || null;

const isGroupLandingPage =
  !(brand === "alen" && isGroupPage) &&
  (isGroupPage || isPackagingUnderGroup) &&
  serverPackagingList.length > 0 &&
  !currentPack;

const serverItems = isGroupLandingPage
  ? serverPackagingList
  : Array.isArray(list)
  ? list
  : [];

const serverCartonQty = isGroupLandingPage
  ? null
  : isDirectProducts
  ? null
  : currentPack?.cartonQty ?? null;

const serverPackTitle = isDirectProducts
  ? {
      en: "Direct Products",
      ar: "منتجات مباشرة",
      ku: "بەرهەمی ڕاستەوخۆ",
    }
  : isGroupLandingPage
  ? currentProductGroup?.title ?? {
      en: "",
      ar: "",
      ku: "",
    }
  : currentPack?.title ??
    currentProductGroup?.title ?? {
      en: "",
      ar: "",
      ku: "",
    };

const serverBackHref = isDirectProducts
  ? brand === "alen"
    ? `/?lang=${lang}#products`
    : `/brand/${brand}/products?lang=${lang}`
  : isPackagingUnderGroup
  ? `/brand/${brand}/products/${category}/${activeProductGroupSlug}?lang=${lang}`
  : `/brand/${brand}/products/${category}?lang=${lang}`;

if (brand === "alshafi") {
  return (
    <ProductGroupPageClient
      brand={brand}
      category={category}
      group={slug}
      lang={lang}
      serverItems={Array.isArray(list) ? list : []}
      serverPackTitle={
        currentProductGroup?.title ?? {
          en: "",
          ar: "",
          ku: "",
        }
      }
      serverProductGroupsList={
        Array.isArray(productGroupsList) ? productGroupsList : []
      }
      allCategories={Array.isArray(categories) ? categories : []}
      page={page}
      perPage={PER_PAGE}
      total={Number(total || 0)}
    />
  );
}

if (brand === "goly-rozh") {
  return (
    <GolyRozhProductGalleryClient
      brand={brand}
      category={category}
      group={slug}
      lang={lang}
      items={serverItems}
      title={serverPackTitle}
      productGroups={
        Array.isArray(productGroupsList) ? productGroupsList : []
      }
      allCategories={
        Array.isArray(categories) ? categories : []
      }
      backHref={serverBackHref}
      page={page}
      perPage={PER_PAGE}
      total={Number(total || 0)}
    />
  );
}

return (
  <PackagingGalleryClient
    brand={brand}
    category={category}
    packaging={slug}
    lang={lang}
    serverItems={serverItems}
    serverCartonQty={serverCartonQty}
    serverPackTitle={serverPackTitle}
    serverPackagingList={serverPackagingList}
    serverProductGroupsList={
      Array.isArray(productGroupsList) ? productGroupsList : []
    }
    serverBackHref={serverBackHref}
    isGroupLandingPage={isGroupLandingPage}
    page={page}
    perPage={PER_PAGE}
    total={Number(total || 0)}
    allCategories={Array.isArray(categories) ? categories : []}
  />
);
}