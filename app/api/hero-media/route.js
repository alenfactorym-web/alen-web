export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";

export async function GET() {
  const query = `
    *[_type=="heroMedia" && coalesce(isActive,true)==true]
    | order(_createdAt desc)[0]{
      _id,
      title,
      "heroImage": heroImage.asset->url,
      "heroVideo": heroVideo.asset->url
    }
  `;

  try {
    const item = await client.fetch(query);

    return new Response(JSON.stringify({ item: item || null }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

