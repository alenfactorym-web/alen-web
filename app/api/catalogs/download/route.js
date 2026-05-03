export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("file");
    const name = searchParams.get("name") || "catalog";

    if (!fileUrl) {
      return new Response(JSON.stringify({ error: "Missing file URL" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const upstream = await fetch(fileUrl);

    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch file" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const arrayBuffer = await upstream.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${name}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

