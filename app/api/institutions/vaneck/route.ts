import { jsonError, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const endpoint = process.env.VANECK_DATA_API_URL;
  const apiKey = process.env.VANECK_DATA_API_KEY;

  if (!endpoint) {
    return jsonError(
      503,
      "provider_not_configured",
      "Configure VANECK_DATA_API_URL with a verified provider endpoint for VanEck fund data.",
      { institution: "VanEck", source: null, data: [] }
    );
  }

  try {
    const headers = new Headers({ Accept: "application/json" });
    if (apiKey) headers.set("Authorization", `Bearer ${apiKey}`);
    const response = await fetch(endpoint, { headers, next: { revalidate: 900 } });
    if (!response.ok) {
      return jsonError(502, "provider_error", "VanEck data provider returned a non-success status.", {
        providerStatus: response.status,
      });
    }
    return jsonOk({
      institution: "VanEck",
      source: new URL(endpoint).origin,
      retrieved_at: new Date().toISOString(),
      data: await response.json(),
    }, 900);
  } catch {
    return jsonError(502, "provider_unreachable", "Could not fetch VanEck data provider.");
  }
}
