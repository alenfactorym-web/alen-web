import { client } from "@/sanity/lib/client";

export async function GET() {
  const query = `
  *[_type=="aboutSection" && coalesce(isActive,true)==true][0]{
    title,
    subtitle,
    body,
    "mainImage": mainImage.asset->url,
    "qualityImage": qualityImage.asset->url,
    "qualityImageSquare": qualityImageSquare.asset->url,
    "productionImage": productionImage.asset->url,
    "productionImageSquare": productionImageSquare.asset->url,
    "distributionImage": distributionImage.asset->url,
    "distributionImageSquare": distributionImageSquare.asset->url
  }`;

  const item = await client.fetch(query);

  return Response.json({ item });
}

