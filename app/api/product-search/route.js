import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const q = String(searchParams.get("q") || "").trim();
    const brand = String(searchParams.get("brand") || "")
      .trim()
      .toLowerCase();

    if (!brand || !/^[a-z0-9-]+$/.test(brand)) {
      return NextResponse.json(
        { results: [], error: "Invalid brand" },
        { status: 400 }
      );
    }

    if (q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = q
      .replace(/[*?]/g, "")
      .slice(0, 80)
      .trim();

    if (searchTerm.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const pattern = `*${searchTerm}*`;

    const results = await client.fetch(
      `
      *[
        _type == "product" &&
        brand->slug.current == $brand &&
        coalesce(isActive, true) == true &&
        coalesce(category->isActive, true) == true &&
        (
          !defined(productGroup) ||
          coalesce(productGroup->isActive, true) == true
        ) &&
        (
          !defined(packaging) ||
          coalesce(packaging->isActive, true) == true
        ) &&
        (
          title.en match $pattern ||
          title.ar match $pattern ||
          title.ku match $pattern ||
          sku match $pattern
        )
      ]
      | order(coalesce(order, 999999) asc, title.en asc)
      [0...50] {
        _id,
        sku,
        title,

        "image": coalesce(
          coverImage.asset->url,
          images[0].asset->url
        ),

        "brand": brand->slug.current,

        "category": category->{
          "slug": slug.current,
          title
        },

        "productGroup": productGroup->{
          "slug": slug.current,
          title
        },

        "packaging": packaging->{
          "slug": slug.current,
          title,
          "productGroupSlug": productGroup->slug.current
        }
      }
      `,
      { brand, pattern }
    );

    return NextResponse.json({
      results: Array.isArray(results) ? results : [],
    });
  } catch (error) {
    console.error("Product search error:", error);

    return NextResponse.json(
      { results: [], error: "Search failed" },
      { status: 500 }
    );
  }
}