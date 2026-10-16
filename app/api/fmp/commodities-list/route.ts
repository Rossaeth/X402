import { jsonError, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.FMP_API_KEY;
  if (!key) {
    return jsonError(503, "api_key_required", "Set FMP_API_KEY in Vercel to enable the FMP commodities list.", {
      provider: "Financial Modeling Prep",
      signup_url: "https://site.financialmodelingprep.com/developer/docs/stable/commodities-list",
    });
  }

  const upstream = new URL("https://financialmodelingprep.com/stable/commodities-list");
  upstream.searchParams.set("apikey", key);

  try {
    const response = await fetch(upstream, { cache: "no-store" });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return jsonError(
        response.status === 401 || response.status === 403 ? 502 : response.status,
        "commodities_provider_error",
        "Financial Modeling Prep returned an error. Check the API key and plan access.",
        { provider: "Financial Modeling Prep", provider_status: response.status, details: payload },
      );
    }

    return jsonOk({
      source: "Financial Modeling Prep",
      endpoint: "/stable/commodities-list",
      retrieved_at: new Date().toISOString(),
      pricing: { planned_usdc_per_call: "0.02", x402_enabled: false },
      data: payload,
    }, 300);
  } catch {
    return jsonError(502, "provider_unreachable", "Could not reach the FMP commodities list endpoint.", {
      provider: "Financial Modeling Prep",
    });
  }
}
