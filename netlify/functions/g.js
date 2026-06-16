// netlify/functions/g.js
export default async (req) => {
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode");
  const tl = url.searchParams.get("tl") || "en";
  const q = url.searchParams.get("q") || "";
  try {
    if (mode === "tts") {
      const g = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob"
        + "&tl=" + encodeURIComponent(tl) + "&q=" + encodeURIComponent(q);
      const r = await fetch(g, { headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://translate.google.com/" } });
      const buf = await r.arrayBuffer();
      return new Response(buf, { status: r.status, headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=86400", "Access-Control-Allow-Origin": "*" } });
    }
    const g = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&dt=t"
      + "&tl=" + encodeURIComponent(tl) + "&q=" + encodeURIComponent(q);
    const r = await fetch(g, { headers: { "User-Agent": "Mozilla/5.0" } });
    const txt = await r.text();
    return new Response(txt, { status: r.status, headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=86400", "Access-Control-Allow-Origin": "*" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 502, headers: { "Content-Type": "application/json" } });
  }
};
