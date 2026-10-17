export const dynamic = "force-static";

export async function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0b1220"/><path d="M14 42 26 16h8l16 32h-9l-4-9H25l-4 9h-9l2-6zm14-11h6l-3-7z" fill="#60a5fa"/><circle cx="48" cy="16" r="5" fill="#34d399"/></svg>`;
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400"
    }
  });
}
