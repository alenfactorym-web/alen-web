import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

const BRAND = "goly-rozh";

export async function GET() {
  try {
    const [
      categories,
      productGroups,
      packaging,
      directProducts,
    ] = await Promise.all([
      /* =========================
         CATEGORIES
         ========================= */

      client.fetch(
        `
        *[
          _type == "category" &&
          brand->slug.current == $brand &&
          coalesce(isActive, true) == true
        ]
        | order(
            coalesce(order, 999999) asc,
            _createdAt asc
          )
        {
          _id,
          "slug": slug.current,
          title,
          "order": order
        }
        `,
        {
          brand: BRAND,
        }
      ),

      /* =========================
         PRODUCT GROUPS
         ========================= */

      client.fetch(
        `
        *[
          _type == "productGroup" &&
          brand->slug.current == $brand &&
          coalesce(isActive, true) == true &&
          defined(category)
        ]
        | order(
            coalesce(order, 9999) asc,
            _createdAt asc
          )
        {
          _id,
          "slug": slug.current,

          title,

          "categoryId":
            category._ref,

          "image":
            coalesce(
              image.asset->url,
              coverImage.asset->url,
              images[0].asset->url
            ),

          "order": order
        }
        `,
        {
          brand: BRAND,
        }
      ),

      /* =========================
         PACKAGING
         ========================= */

      client.fetch(
        `
        *[
          _type == "packaging" &&
          brand->slug.current == $brand &&
          coalesce(isActive, true) == true &&
          defined(category) &&
          !defined(productGroup)
        ]
        | order(
            coalesce(order, 9999) asc,
            _createdAt asc
          )
        {
          _id,
          "slug": slug.current,

          title,

          "categoryId":
            category._ref,

          "image":
            coalesce(
              image.asset->url,
              coverImage.asset->url,
              images[0].asset->url
            ),

          "order": order
        }
        `,
        {
          brand: BRAND,
        }
      ),

      /* =========================
         DIRECT PRODUCTS
         only needed for count
         ========================= */

      client.fetch(
        `
        *[
          _type == "product" &&
          brand->slug.current == $brand &&
          coalesce(isActive, true) == true &&
          defined(category) &&
          !defined(productGroup) &&
          !defined(packaging)
        ]
        {
          "categoryId":
            category._ref
        }
        `,
        {
          brand: BRAND,
        }
      ),
    ]);

    /* =========================
       SAFE ARRAYS
       ========================= */

    const safeCategories =
      Array.isArray(categories)
        ? categories
        : [];

    const safeProductGroups =
      Array.isArray(productGroups)
        ? productGroups
        : [];

    const safePackaging =
      Array.isArray(packaging)
        ? packaging
        : [];

    const safeDirectProducts =
      Array.isArray(directProducts)
        ? directProducts
        : [];

    /* =========================
       BUILD MASTER CATEGORY RAIL
       ========================= */

    const categoryRail =
      safeCategories.map(
        (category) => {
          const categoryId =
            category._id;

          const categoryProductGroups =
            safeProductGroups.filter(
              (item) =>
                item.categoryId ===
                categoryId
            );

          const categoryPackaging =
            safePackaging.filter(
              (item) =>
                item.categoryId ===
                categoryId
            );

          const directProductsCount =
            safeDirectProducts.filter(
              (item) =>
                item.categoryId ===
                categoryId
            ).length;

          return {
            ...category,

            productGroups:
              categoryProductGroups,

            packaging:
              categoryPackaging,

            directProductsCount,
          };
        }
      );

    return NextResponse.json(
      {
        categories:
          categoryRail,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "GOLY ROZH category rail fetch failed:",
      error
    );

    return NextResponse.json(
      {
        categories: [],
      },
      {
        status: 500,

        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}